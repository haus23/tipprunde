import { Transition } from '@headlessui/react';
import Logo from '@/layouts/components/Logo';

export default function SplashScreen() {
  return (
    <div
      className="
      absolute
      z-50
      w-screen
      h-screen
      flex flex-col
      items-center
      justify-center

    "
    >
      <div className="flex flex-col items-center gap-y-6 w-48 sm:w-64">
        <span className="text-4xl px-6 font-semibold">runde.tips</span>
        <Logo className="w-48 sm:w-64" />
      </div>
    </div>
  );
}
