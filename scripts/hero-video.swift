// Gera o vídeo do hero a partir do original: loop contínuo com fusão na emenda,
// recorte 2:3, H.264 sem áudio (~2 MB) e o pôster. Só macOS (AVFoundation).
//
// Uso:
//   swift scripts/hero-video.swift public/herovideo.mov public/media/hero-bandeira.mp4 public/media/hero-bandeira-poster.jpg
//
// Ajuste s0/fade/loopLength (trecho do original) e cropY (posição do recorte) se o vídeo mudar.
import AVFoundation
import AppKit

let args = CommandLine.arguments
let srcURL = URL(fileURLWithPath: args[1])
let outURL = URL(fileURLWithPath: args[2])
let posterURL = URL(fileURLWithPath: args[3])

let s0 = 3.0, fade = 1.0, loopLength = 8.0          // trecho de origem: 3,0s a 12,0s
let cropY = 290.0, cropH = 3240.0                     // faixa 2:3 centrada na bandeira, com céu acima
let renderSize = CGSize(width: 864, height: 1296)
let scale = renderSize.height / cropH
func t(_ s: Double) -> CMTime { CMTime(seconds: s, preferredTimescale: 600) }

let done = DispatchSemaphore(value: 0)
Task {
    do {
        let asset = AVURLAsset(url: srcURL)
        let source = try await asset.loadTracks(withMediaType: .video).first!
        let comp = AVMutableComposition()
        let trackA = comp.addMutableTrack(withMediaType: .video, preferredTrackID: kCMPersistentTrackID_Invalid)!
        let trackB = comp.addMutableTrack(withMediaType: .video, preferredTrackID: kCMPersistentTrackID_Invalid)!
        // A: s0+fade .. s0+fade+L, ocupando todo o loop. B: s0 .. s0+fade, nos últimos `fade` segundos.
        try trackA.insertTimeRange(CMTimeRange(start: t(s0 + fade), duration: t(loopLength)), of: source, at: .zero)
        try trackB.insertTimeRange(CMTimeRange(start: t(s0), duration: t(fade)), of: source, at: t(loopLength - fade))

        let transform = CGAffineTransform(translationX: 0, y: -cropY).concatenating(CGAffineTransform(scaleX: scale, y: scale))

        let solo = AVMutableVideoCompositionInstruction()
        solo.timeRange = CMTimeRange(start: .zero, duration: t(loopLength - fade))
        let soloA = AVMutableVideoCompositionLayerInstruction(assetTrack: trackA)
        soloA.setTransform(transform, at: .zero)
        solo.layerInstructions = [soloA]

        let blend = AVMutableVideoCompositionInstruction()
        blend.timeRange = CMTimeRange(start: t(loopLength - fade), duration: t(fade))
        let topB = AVMutableVideoCompositionLayerInstruction(assetTrack: trackB)
        topB.setTransform(transform, at: t(loopLength - fade))
        topB.setOpacityRamp(fromStartOpacity: 0, toEndOpacity: 1, timeRange: blend.timeRange)
        let underA = AVMutableVideoCompositionLayerInstruction(assetTrack: trackA)
        underA.setTransform(transform, at: t(loopLength - fade))
        blend.layerInstructions = [topB, underA]

        let videoComposition = AVMutableVideoComposition()
        videoComposition.renderSize = renderSize
        videoComposition.frameDuration = CMTime(value: 1, timescale: 25)
        videoComposition.instructions = [solo, blend]

        // Leitura da composição e escrita em H.264
        let reader = try AVAssetReader(asset: comp)
        let output = AVAssetReaderVideoCompositionOutput(videoTracks: [trackA, trackB], videoSettings: [
            kCVPixelBufferPixelFormatTypeKey as String: kCVPixelFormatType_420YpCbCr8BiPlanarVideoRange,
        ])
        output.videoComposition = videoComposition
        reader.add(output)

        try? FileManager.default.removeItem(at: outURL)
        let writer = try AVAssetWriter(outputURL: outURL, fileType: .mp4)
        writer.shouldOptimizeForNetworkUse = true
        let input = AVAssetWriterInput(mediaType: .video, outputSettings: [
            AVVideoCodecKey: AVVideoCodecType.h264,
            AVVideoWidthKey: Int(renderSize.width),
            AVVideoHeightKey: Int(renderSize.height),
            AVVideoCompressionPropertiesKey: [
                AVVideoAverageBitRateKey: 2_200_000,
                AVVideoProfileLevelKey: AVVideoProfileLevelH264HighAutoLevel,
                AVVideoMaxKeyFrameIntervalKey: 50,
                AVVideoExpectedSourceFrameRateKey: 25,
            ] as [String: Any],
        ])
        input.expectsMediaDataInRealTime = false
        writer.add(input)

        writer.startWriting()
        writer.startSession(atSourceTime: .zero)
        reader.startReading()
        var frames = 0
        while let sample = output.copyNextSampleBuffer() {
            while !input.isReadyForMoreMediaData { usleep(2000) }
            input.append(sample)
            frames += 1
        }
        input.markAsFinished()
        await writer.finishWriting()
        print("vídeo:", writer.status == .completed ? "ok" : "falhou \(String(describing: writer.error))", "quadros:", frames)

        // Pôster: primeiro quadro do loop, no mesmo recorte
        let gen = AVAssetImageGenerator(asset: comp)
        gen.videoComposition = videoComposition
        gen.requestedTimeToleranceBefore = .zero
        gen.requestedTimeToleranceAfter = .zero
        let (image, _) = try await gen.image(at: .zero)
        let jpeg = NSBitmapImageRep(cgImage: image).representation(using: .jpeg, properties: [.compressionFactor: 0.82])!
        try jpeg.write(to: posterURL)
        print("pôster:", image.width, "x", image.height)
    } catch {
        print("erro:", error)
    }
    done.signal()
}
done.wait()
