import RestaurantLocation from "@/components/location";
import RestaurantHeroCarousel from "@/components/ui/heroCarousel";


export default function SomePage() {
  return (
    <div className="w-full">
      <RestaurantHeroCarousel />
      <RestaurantLocation />
    </div>
  )
}
