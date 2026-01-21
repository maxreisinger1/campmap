export default function CommentSection() {
  return (
    <section className="w-full relative bg-black mx-auto py-8 md:py-10 pb-12 md:pb-32 px-4 md:px-12 lg:px-16 overflow-hidden hidden sm:block">
      <div className="mx-auto flex flex-col gap-8 items-center">
        <div className="flex flex-col items-center w-full">
          <h2 className="text-center text-[#ffffff] font-bold text-[22px] sm:text-[36px] tracking-wide uppercase px-2">
            What PEOPLE ARE SAYING
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 max-w-6xl mx-auto mt-8 md:mt-12 items-start">
            {/* Left Column */}
            <div className="flex flex-col gap-6 items-start">
              <img
                src="/images/reviews/review-1.png"
                alt="Review 1"
                className="h-auto max-w-full"
              />
              <img
                src="/images/reviews/review-2.png"
                alt="Review 2"
                className="h-auto max-w-[80%] ml-12"
              />
              <img
                src="/images/reviews/review-3.png"
                alt="Review 3"
                className="h-auto max-w-[80%]"
              />
            </div>
            {/* Right Column */}
            <div className="flex flex-col gap-6 items-start">
              <img
                src="/images/reviews/review-4.png"
                alt="Review 4"
                className="h-auto max-w-[90%] ml-8"
              />
              <img
                src="/images/reviews/review-5.png"
                alt="Review 5"
                className="h-auto max-w-[85%]"
              />
              <img
                src="/images/reviews/review-6.png"
                alt="Review 6"
                className="h-auto max-w-[88%] ml-6"
              />
            </div>
          </div>

          <div className="max-w-2xl flex flex-row items-center justify-center gap-2 px-2 mt-28">
            <a
              href="https://letterboxd.com/film/two-sleepy-people/"
              target="_blank"
              rel="noreferrer"
            >
              <img
                src="/images/v9/socials/letterboxd.png"
                alt="Director Baron Ryan"
              />
            </a>
            <a href="https://www.imdb.com/title/tt38565998/">
              <img
                src="/images/v9/socials/rating.png"
                alt="Written and Directed by"
              />
            </a>
            <a href="https://www.imdb.com/title/tt38565998/">
              <img
                src="/images/v9/socials/IMDb-rating.png"
                alt="Director Baron Ryan"
              />
            </a>
            <a href="https://www.imdb.com/title/tt38565998/">
              <img
                src="/images/v9/socials/IMDb-logo.png"
                alt="Written and Directed by"
              />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
