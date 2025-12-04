import { StandaloneProvider } from "./StandaloneContext";

export default function StandaloneLayout({ children }: { children: React.ReactNode }) {
  return <StandaloneProvider>{children}</StandaloneProvider>;
}
