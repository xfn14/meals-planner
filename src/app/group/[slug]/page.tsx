export default async function UserButton({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return <div className="flex items-center">{slug}</div>;
}
