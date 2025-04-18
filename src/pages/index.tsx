export default async function HomePage() {
  return (
    <div>
      <title>runde.tips</title>
      <h1 className="text-2xl font-medium p-2">runde.tips</h1>
    </div>
  );
}

export const getConfig = async () => {
  return {
    render: 'static',
  } as const;
};
