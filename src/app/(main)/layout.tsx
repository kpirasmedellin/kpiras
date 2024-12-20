import Footer from "@/components/ui/footer";
import NavBarMain from "@/components/ui/navBarMain";
import type { Metadata } from "next";
import { Onest } from "next/font/google";
import clsx from "clsx"


export const metadata: Metadata = {
  title: "Kpiras",
  description: "El sitio de las papas ricas en Medellín",
};

const roboto = Onest({weight:"400",style:"normal",subsets:["latin"]})


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
        <body className={clsx(roboto.className, "container flex flex-col m-auto items-center bg-mainyellow bg-cover bg-center")}>
        <NavBarMain />
        {children}
        <Footer />
      </body>
    </html>
  );
}
