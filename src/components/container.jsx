export default function Container({ children }) {
  return (
    <div className="flex justify-center">
      <div className="px-4 w-full" style={{ maxWidth: "1600px" }}>
        {children}
      </div>
    </div>
  );
}
