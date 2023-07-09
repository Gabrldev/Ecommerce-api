type Props = {
  children: React.ReactNode;
};
function layout({ children }: Props) {
  return (
    <div className="flex items-center justify-center h-full w-full">
      {children}
    </div>
  );
}
export default layout;
