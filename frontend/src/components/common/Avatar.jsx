const colors = [
  "from-blue-500 to-indigo-600",
  "from-purple-500 to-pink-600",
  "from-green-500 to-emerald-600",
  "from-orange-500 to-red-500",
];

function Avatar({
  firstName,
  lastName,
}) {

  const initials =
    `${firstName?.[0] || ""}${lastName?.[0] || ""}`;

  const index =
    initials.charCodeAt(0) % colors.length;

  return (

    <div
      className={`w-12 h-12 rounded-full bg-gradient-to-r ${colors[index]} flex items-center justify-center text-white font-bold`}
    >

      {initials.toUpperCase()}

    </div>

  );

}

export default Avatar;