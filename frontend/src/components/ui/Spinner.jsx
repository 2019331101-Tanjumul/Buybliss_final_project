export const Spinner = () => {
  return (
    <div className="spinner-overlay">
      <div className="spinner-content">
        <span>Loading. Please wait ... </span>
        <div className="spinner" />
      </div>
    </div>
  );
};
