import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

export default function NotFound() {
  return (
    <>
      <Helmet>
        <title>Page not found | Alsinan Transportation</title>
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      <main id="primary" className="site-main">

      <section className="banner_home banner_inner banner_404" style={{ backgroundImage: "url('/wp-content/uploads/2025/10/banner_bg.webp')" }}>
      <div className="banner_shadow"></div>
      <div className="container h-100">
      <div className="row h-100 justify-content-center">
      <div className="col-xl-6 my-auto">
      <div className="content_banner text-center">
      <h1 className="page-title">Oops! That page can&rsquo;t be found.</h1>
      <p>It looks like nothing was found at this location.</p>
      <Link className="btn btn-primary" to="/">Back to Home</Link>
      </div>
      </div>
      </div>
      </div>
      </section>

      <section className="error-404 not-found my-5">
      <div className="container h-100">
      <div className="row h-100 justify-content-center">
      <div className="col-xl-7 my-auto">
      <img src="/wp-content/uploads/2025/10/img_404.jpg" alt="Illustration for a page that could not be found" />
      </div>
      </div>
      </div>
      </section>
      </main>
    </>
  );
}
