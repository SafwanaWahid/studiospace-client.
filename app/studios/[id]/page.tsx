import Details from "@/components/details";
export const metadata = { title: "Studio details" };
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <Details id={id} />;
}
