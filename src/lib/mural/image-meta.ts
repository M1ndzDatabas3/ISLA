/**
 * Lê uma imagem de /public no build: dimensões reais e um blur minúsculo
 * (placeholder do next/image). Falha alto se o arquivo não existir, para
 * ninguém publicar uma obra com caminho errado.
 */
import { stat } from "node:fs/promises";
import { join } from "node:path";

import sharp from "sharp";

// `type` (e não `interface`): o Content Collections só aceita objetos serializáveis.
export type ImageMeta = {
  largura: number;
  altura: number;
  blurDataURL: string;
};

export async function readImageMeta(src: string): Promise<ImageMeta> {
  const file = join(process.cwd(), "public", src);
  try {
    await stat(file);
  } catch {
    throw new Error(`Imagem não encontrada: public${src}`);
  }
  const image = sharp(file).rotate();
  const meta = await image.metadata();
  const largura = meta.autoOrient?.width ?? meta.width ?? 0;
  const altura = meta.autoOrient?.height ?? meta.height ?? 0;
  const blur = await image.clone().resize(16).jpeg({ quality: 45 }).toBuffer();
  return {
    largura,
    altura,
    blurDataURL: `data:image/jpeg;base64,${blur.toString("base64")}`,
  };
}

/** Tamanho legível de um arquivo de download ("4,2 MB"). */
export async function readFileSize(src: string): Promise<string> {
  const file = join(process.cwd(), "public", src);
  let bytes: number;
  try {
    bytes = (await stat(file)).size;
  } catch {
    throw new Error(`Arquivo para download não encontrado: public${src}`);
  }
  const mb = bytes / (1024 * 1024);
  return mb >= 1
    ? `${mb.toLocaleString("pt-BR", { maximumFractionDigits: 1 })} MB`
    : `${Math.max(1, Math.round(bytes / 1024))} KB`;
}
