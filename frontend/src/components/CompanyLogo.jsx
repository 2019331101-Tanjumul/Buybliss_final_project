

export const CompanyLogo = ({ company }) => {
  return (
    <div>
      {company === "Ryans" && <img src="/ryans-logo.svg" alt="company logo" className="company-logo" />}
      {company === "StarTech" && <img src="/star-tech-logo.png" alt="company logo" className="company-logo" />}
      {company === "TechLandBD" && <img src="/techland-logo.png" alt="company logo"  className="company-logo"/>}
      {company === "AppleGadgets" && <img src="/applegadgets-logo.png" alt="company logo" className="company-logo" />}
    </div>
  );
};
