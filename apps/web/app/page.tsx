import Slider from "@repo/ui/src/components/slider";
import data from "@repo/ui/src/components/data";

export default function Page(): JSX.Element {
  return (
    <div>
      <Slider data={data} activeSlide={2} />
    </div>
  );
}
