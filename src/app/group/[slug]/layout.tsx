import Navbar from "@/components/navbar";

export default async function GroupLayout({
  params,
  children,
}: {
  params: Promise<{ slug: string }>;
  children: React.ReactNode;
}) {
  const { slug } = await params;

  return (
    <>
      <Navbar slug={slug} />

      <main className="container mx-auto px-4 py-8">{children}</main>
    </>
  );
}
