import { JoinDialog } from "@/components/community/join-dialog";
import { ComingSoon, comingSoonMetadata } from "@/components/layout/coming-soon";

export const metadata = comingSoonMetadata("publique");

export default function Page() {
  return (
    <ComingSoon
      section="publique"
      action={
        <JoinDialog caminho="conteudo">
          <button type="button" className="link-underline cursor-pointer text-sm font-medium">
            Quero escrever para o Instituto
          </button>
        </JoinDialog>
      }
    />
  );
}
