import React, { useState } from "react";
import { features } from "./modules/index";
import MainMenu from "./MainMenu";

function App() {
  const [activePath, setActivePath] = useState<string | null>(null);

  if (!activePath) {
    return <MainMenu onSelect={(p) => setActivePath(p)} />;
  }

  const feature = features.find((f) => f.path === activePath);
  if (!feature) return <div>Feature not found</div>;

  const Component = feature.component;

  return (
    <div className="p-4">
      <button
        className="mb-4 text-blue-600 underline"
        onClick={() => setActivePath(null)}
      >
        ← Back to Main Menu
      </button>
      <Component />
    </div>
  );
}

export default App;
