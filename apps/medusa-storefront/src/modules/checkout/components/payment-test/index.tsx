import { Badge } from "@medusajs/ui"

type PaymentTestProps = {
  className?: string
}

const PaymentTest = ({ className }: PaymentTestProps) => {
  return (
    <Badge color="orange" className={className} role="alert">
      <span className="font-semibold">Attention:</span> For testing purposes
      only.
    </Badge>
  )
}

export default PaymentTest
