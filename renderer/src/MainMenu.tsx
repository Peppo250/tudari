import React from "react";
import { features } from "./modules/index";


interface Props {
  onSelect: (path: string) => void;
}

const MainMenu: React.FC<Props> = ({ onSelect }) => {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Tudari - Main Menu</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {features.map((f) => (
          <button
            key={f.path}
            onClick={() => onSelect(f.path)}
            className="border rounded-2xl p-6 bg-white hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold">{f.name}</h2>
            <p className="text-sm text-gray-600 mt-2">{f.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MainMenu;
