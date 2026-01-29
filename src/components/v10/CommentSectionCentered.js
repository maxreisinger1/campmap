export default function CommentSectionCentered() {
  return (
    <div className="mx-auto flex flex-col gap-8 items-center sm:hidden">
      <div className="flex flex-col gap-4">
        <img
          src="/images/reviews/review-1.png"
          alt="Review 1"
          className="h-auto rounded-lg shadow-md"
        />
        <img
          src="/images/reviews/review-2.png"
          alt="Review 2"
          className="h-auto rounded-lg shadow-md"
        />
        <img
          src="/images/reviews/review-3.png"
          alt="Review 3"
          className="h-auto rounded-lg shadow-md"
        />
        <img
          src="/images/reviews/review-4.png"
          alt="Review 3"
          className="h-auto rounded-lg shadow-md"
        />
      </div>

      <div className="flex flex-col items-center justify-center gap-2">
        <span className="uppercase text-white font-light tracking-wider text-xs">
          See Full Reviews On:
        </span>
        <div className="flex flex-row gap-2">
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
          <a href="https://www.rottentomatoes.com/m/two_sleepy_people">
            <img
              src="/images/v10/rotten-tomatoes.png"
              alt="Written and Directed by"
            />
          </a>
        </div>
      </div>

      <div className="flex flex-col gap-6 items-center justify-center my-4">
        <h3 className="font-bold text-white leading-7 text-center text-2xl uppercase">
          TICKETS OFFICIALLY ON SALE <br /> for JAN 23{" "}
          <span className="italic font-light">(Opening Weekend):</span>
        </h3>

        <div className="text-white flex flex-col gap-4 font-light text-start text-sm max-w-3xl mx-auto">
          On January 23rd, After Months of Pitching to Theaters and Getting
          20,000+ People TO Join The Movement, We're OFFICIALLY RELEASING IN
          Theaters.
          <p />
          <p className="font-bold">
            But, We Need Your Help To Make Film History.
          </p>
          <p>
            The More People Show Up Now, The More Likely We Are to Stay in
            Theaters and Keep Expanding.
          </p>
        </div>
      </div>
    </div>
  );
}
