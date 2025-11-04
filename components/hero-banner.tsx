import Image from "next/image"

export function HeroBanner() {
  return (
    <section className="relative w-full bg-black">
      <div className="w-full">
        <Image
          src="/images/design-mode/image.png"
          alt="Banner Dominus Tech - Variedade em Eletrônicos"
          width={1920}
          height={400}
          className="w-full h-auto object-cover"
          priority
        />
      </div>
    </section>
  )
}
