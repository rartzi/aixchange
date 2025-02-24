import { type Event } from "@/types/event"
import { Card, CardContent } from "@/components/ui/card"

type EventRulesProps = {
  event: Event
}

export default function EventRules({ event }: EventRulesProps) {
  const prizes = event.prizes as { [key: string]: string } | null

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-semibold mb-4">Rules</h3>
        <div className="prose dark:prose-invert max-w-none">
          {event.rules}
        </div>
      </div>

      {prizes && Object.keys(prizes).length > 0 && (
        <div>
          <h3 className="text-2xl font-semibold mb-4">Prizes</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(prizes).map(([place, prize]) => (
              <Card key={place}>
                <CardContent className="pt-6">
                  <h4 className="text-lg font-semibold mb-2">{place}</h4>
                  <p className="text-muted-foreground">{prize}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}