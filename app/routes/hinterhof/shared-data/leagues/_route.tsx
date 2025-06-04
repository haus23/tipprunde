import {Button} from "~/components/ui/button";

export default function LeaguesRoute() {
  return <div>
    <div className="mx-2 flex items-center justify-between sm:mx-0">
      <h1 className="font-medium text-2xl">Ligen</h1>
      <Button  variant="default">
        Neue Liga
      </Button>
    </div>
  </div>
}
