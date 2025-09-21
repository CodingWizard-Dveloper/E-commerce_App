export default function Loader({ message = "" }) {
  return (
    <div
      className="mx-auto w-full flex justify-center flex-col"
      style={{ alignItems: "center" }}
    >
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <span>{message}</span>
    </div>
  );
}
