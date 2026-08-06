import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer id="contact" className="bg-[#8B1E4D] text-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">

        {/* Main Footer */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-[1fr_auto_1fr] md:gap-10">

 {/* Brand */}
<div className="pt-5 text-center md:text-left">
  <h2 className="text-2xl font-bold">
    HunarConnect
  </h2>

  <p className="mt-3 max-w-sm text-sm leading-6 text-white/80">
    Connecting talented women artisans across Pakistan with
    customers who appreciate handmade craftsmanship.
  </p>

  {/* Team Credits */}
  <div className="mt-6">
    <p className="text-xs uppercase tracking-[0.3em] text-white/60">
      Developed By
    </p>

    <h3 className="mt-2 text-lg font-semibold text-white">
      Team HunarConnect
    </h3>

    <p className="mt-2 text-sm leading-6 text-white/75">
      ILSA • NOOR • SABI • SAIRA
    </p>

  </div>
</div>

          {/* Logo */}
          <div className="flex items-center justify-center">
            <Image
              src="/images/hunarconnect-logo.png"
              alt="HunarConnect Logo"
              width={210}
              height={210}
              className="h-auto w-36 object-contain sm:w-44 md:w-[210px]"
            />
          </div>

          {/* Right Section */}
          <div className="grid grid-cols-1 gap-6 pt-5 min-[360px]:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] min-[360px]:gap-4 md:grid-cols-2 md:gap-10">

            {/* Quick Links */}
            <div className="min-w-0">
              <h3 className="text-base font-semibold uppercase tracking-wide">
                Quick Links
              </h3>

              <ul className="mt-3 space-y-2 text-sm text-white/80">
                <li>
                  <Link href="/" className="hover:text-white transition-colors">
                    Home
                  </Link>
                </li>

                <li>
                  <Link
                    href="/#categories"
                    className="hover:text-white transition-colors"
                  >
                    Categories
                  </Link>
                </li>

                <li>
                  <Link
                    href="/about"
                    className="hover:text-white transition-colors"
                  >
                    About
                  </Link>
                </li>

                <li>
                  <Link
                    href="/contact"
                    className="hover:text-white transition-colors"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div className="min-w-0">
              <h3 className="text-base font-semibold uppercase tracking-wide">
                Contact
              </h3>

              <div className="mt-3 space-y-3 text-sm text-white/80">
                <div>
                  <span className="font-medium text-white">Email</span>
                  <p className="break-words">sabi.hassan312@gmail.com</p>
                </div>

                <div>
                  <span className="font-medium text-white">Phone</span>
                  <p>+92 312 5554377</p>
                </div>

                <div>
                  <span className="font-medium text-white">Location</span>
                  <p>Rawalpindi, Pakistan</p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Divider */}
        <div className="my-6 border-t border-white/20"></div>

        {/* Bottom Footer */}
        <div className="flex flex-col items-center justify-between gap-3 text-center text-sm text-white/70 md:flex-row md:text-left">

          <p>© 2026 HunarConnect. All Rights Reserved.</p>

          <div className="flex flex-wrap items-center justify-center gap-y-1 md:justify-end">
            <Link
              href="/privacy"
              className="hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>

            <span className="mx-3 text-white/40 sm:mx-4">|</span>

            <Link
              href="/terms"
              className="hover:text-white transition-colors"
            >
              Terms & Conditions
            </Link>
          </div>

        </div>

      </div>
    </footer>
  );
}
