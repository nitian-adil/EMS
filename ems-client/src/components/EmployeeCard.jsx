function EmployeeCard({ emp }) {
  return (
    <div className="bg-white rounded-xl shadow p-5 hover:shadow-lg transition">
      <h3 className="text-lg font-semibold text-slate-800">
        {emp.name}
      </h3>

      <p className="text-sm text-slate-500">
        {emp.email}
      </p>

      <span className="inline-block mt-3 px-3 py-1 text-xs rounded-full bg-indigo-100 text-indigo-700">
        {emp.role}
      </span>
    </div>
  );
}

export default EmployeeCard;
