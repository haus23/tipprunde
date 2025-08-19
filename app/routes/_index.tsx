import { Logo } from "~/components/shell/logo";

export default function Index() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="mb-8">
          <Logo />
        </div>
        <h1 className="text-4xl font-semibold text-gray-900 mb-4">
          runde.tips
        </h1>
      </div>
    </div>
  );
}
