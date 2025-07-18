import { CheckSquare } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckSquare className="w-8 h-8" />
            <h1 className="text-2xl font-bold">TaskManager CRUD</h1>
          </div>
          <div className="text-sm">
            Aplicación de gestión de tareas
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;