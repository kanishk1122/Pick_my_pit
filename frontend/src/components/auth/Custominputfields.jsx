
const Custominputfields = ({ value, ...props }) => {
  return (
    <div>
      <input
        {...props}
        value={value || ''} // Convert null to empty string
      />
    </div>
  );
};