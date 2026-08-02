/* Hand-drawn icons for the Atomic Design levels. These illustrate one specific
   case study's argument, so they live behind the `icons: "atomic"` key on a
   cardGrid block rather than in the shared component surface. */

function AtomIcon() {
  return <div className="w-7 h-7 rounded-full border-2 border-(--accent)/60" />;
}

function MoleculeIcon() {
  return (
    <div className="flex items-center gap-1.5">
      <span className="w-3 h-3 rounded-full bg-(--accent)/50" />
      <span className="w-5 h-px bg-(--accent)/30" />
      <span className="w-4 h-4 rounded-full bg-(--accent)/35" />
      <span className="w-5 h-px bg-(--accent)/30" />
      <span className="w-3 h-3 rounded-full bg-(--accent)/20" />
    </div>
  );
}

function OrganismIcon() {
  return (
    <div className="flex flex-col gap-1 w-9">
      <span className="h-1.5 w-full rounded-sm bg-(--accent)/50" />
      <div className="flex gap-1">
        <span className="h-5 w-3 rounded-sm bg-(--accent)/25" />
        <span className="h-5 flex-1 rounded-sm bg-(--accent)/15" />
      </div>
    </div>
  );
}

/* Applied by card position, so the content file stays free of components. */
export const atomicIcons = [AtomIcon, MoleculeIcon, OrganismIcon];
