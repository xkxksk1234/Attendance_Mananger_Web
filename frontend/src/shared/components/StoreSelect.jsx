export const StoreSelect = ({
  stores,
  selectedStoreId,
  onChange,
  label = '매장 선택',
  selectId = 'storeSelect',
  placeholder = '매장을 선택해주세요.'
}) => {
  if (!stores?.length) {
    return null;
  }

  const handleChange = (event) => {
    onChange?.(event.target.value);
  };

  const showPlaceholder = !selectedStoreId;

  return (
    <div className="store-selector">
      <label htmlFor={selectId}>{label}</label>
      <select
        id={selectId}
        name={selectId}
        className="store-select"
        value={selectedStoreId ?? ''}
        onChange={handleChange}
      >
        {showPlaceholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {stores.map((store) => (
          <option key={store.id} value={String(store.id)}>
            {store.name}
          </option>
        ))}
      </select>
    </div>
  );
};
