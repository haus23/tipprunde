import type { Route } from "./+types/index";

export function meta() {
    return [
        { title: "runde.tips" }
    ];
}

export async function loader({ context }: Route.LoaderArgs) {
    const response = await fetch(`${context.cloudflare.env.UNTERBAU_URL}/api/v1/championships`);
    const data = (await response.json()) as any;
    return { championship: data[0] };
}

export default function Home({loaderData}: Route.ComponentProps) {
    return (
        <div className="p-2">
            <h1 className="text-2xl font-medium">runde.tips</h1>
            <h2 className="text-2xl font-medium">{loaderData.championship.name}</h2>
        </div>
    );
}
