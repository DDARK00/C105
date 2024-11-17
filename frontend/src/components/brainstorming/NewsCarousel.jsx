import Carousel from "../common/Carousel";
import DOMPurify from "dompurify";
import DateType from "../common/DateType";

function NewsCarousel({ slides, currentIndex, setCurrentIndex }) {
  const sanitizedDescription = (description) => {
    return { __html: DOMPurify.sanitize(description) };
  };
  return (
    <>
      <Carousel
        currentIndex={currentIndex}
        setCurrentIndex={setCurrentIndex}
        slides={slides}
      >
        {slides.map((slide, index) => (
          <div
            key={index}
            className="w-full h-full flex-shrink-0 bg-slate-200 break-all space-x-2 p-4 "
          >
            <div className="bg-overlay py-4 px-2 h-full w-full grid grid-cols-1 items-center relative ">
              {/* 슬라이드 콘텐츠 */}
              <div className="text-black flex flex-col">
                <h2 className=" font-semibold inline ">
                  <a
                    href={slide.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full line-clamp-2 inline text-blue-500 hover:underline"
                    dangerouslySetInnerHTML={sanitizedDescription(slide.title)}
                  >
                    {/* <div */}
                    {/* /> */}
                    {/* {slide.title} */}
                  </a>
                </h2>
                <div className="text-right">
                  <DateType dateString={slide.pubDate} />
                </div>
                {/* <div
                    className="text-sm line-clamp-6"
                    dangerouslySetInnerHTML={sanitizedDescription(
                      slide.description
                    )}
                  /> */}
                {/* {slide.description} */}
              </div>
            </div>
          </div>
        ))}
      </Carousel>
    </>
  );
}

export default NewsCarousel;
