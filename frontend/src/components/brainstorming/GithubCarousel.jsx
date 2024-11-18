import Carousel from "../common/Carousel";

function GithubCarousel({ slides, currentIndex, setCurrentIndex }) {
  return (
    <>
      <Carousel
        currentIndex={currentIndex}
        setCurrentIndex={setCurrentIndex}
        slides={slides}
      >
        {slides.map((slide, idx) => (
          <div
            key={idx}
            className=" w-full h-full flex-shrink-0 bg-slate-300 break-all space-x-2 p-4"
          >
            <div className="bg-overlay py-4 px-2 h-full w-full grid grid-cols-1 items-center ">
              {/* 슬라이드 콘텐츠 */}
              <div className="text-black ">
                <h2 className=" font-semibold inline ">
                  <a
                    href={slide.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="line-clamp-2 inline text-blue-500 hover:underline"
                  >
                    {slide.name}
                  </a>
                </h2>

                <span className="text-sm line-clamp-6">
                  {slide.description}
                </span>
              </div>
            </div>
          </div>
        ))}
      </Carousel>
    </>
  );
}

export default GithubCarousel;
