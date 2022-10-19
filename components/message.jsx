export default function Message({ children, avatar, name, description }) {
  return(
    <div className="bg-white p-8 border-b-2">
      <div className="flex items-center gap-2">
        <img 
          referrerPolicy="no-referrer"
          className="w-10 rounded-full"
          src={avatar}
        />
        <h2>{name}</h2>
      </div>
      <div className="py-4">
        <p>{description}</p>
      </div>
      { children }
    </div>
  );
}