export const WorkspaceSelect = ({
  workspaces,
  selectedWorkspaceId,
  onChange,
  label = '워크스페이스 선택',
  selectId = 'workspaceSelect',
  placeholder = '워크스페이스를 선택해주세요.'
}) => {
  if (!workspaces?.length) {
    return null;
  }

  const handleChange = (event) => {
    onChange?.(event.target.value);
  };

  const showPlaceholder = !selectedWorkspaceId;

  return (
    <div className="workspace-selector">
      <label htmlFor={selectId}>{label}</label>
      <select
        id={selectId}
        name={selectId}
        className="workspace-select"
        value={selectedWorkspaceId ?? ''}
        onChange={handleChange}
      >
        {showPlaceholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {workspaces.map((workspace) => (
          <option key={workspace.id} value={workspace.id}>
            {workspace.name}
          </option>
        ))}
      </select>
    </div>
  );
};
