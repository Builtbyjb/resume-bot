type Props = {
  title: string
}

export default function Header({ title }: Props) {
  return (
    <>
      <h1 className="mb-4">{title} </h1>
    </>
  )
}
