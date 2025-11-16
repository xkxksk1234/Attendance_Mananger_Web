import { useState } from 'react';
import { useStore } from '../hooks/useStore.js';

const INITIAL_FORM_STATE = {
  name: '',
  industry: '',
  underFive: false
};

export const DashboardTab = ({ tab }) => {
  const { selectedStore, registerStore, hasStores, storeError } = useStore();
  const [isCreatingStore, setIsCreatingStore] = useState(false);
  const [formState, setFormState] = useState(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormState((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const resetForm = () => {
    setFormState(INITIAL_FORM_STATE);
    setErrors({});
  };

  const handleCancel = () => {
    setIsCreatingStore(false);
    resetForm();
    setSubmitError(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedName = formState.name.trim();
    const trimmedIndustry = formState.industry.trim();
    const nextErrors = {};

    if (!trimmedName) {
      nextErrors.name = '매장명을 입력해주세요.';
    }

    if (!trimmedIndustry) {
      nextErrors.industry = '업종을 입력해주세요.';
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      await registerStore({
        name: trimmedName,
        industry: trimmedIndustry,
        underFive: formState.underFive
      });

      setIsCreatingStore(false);
      resetForm();
    } catch (error) {
      console.error('매장 등록 중 오류가 발생했습니다.', error);
      setSubmitError('매장을 저장하는 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="tab-panel" aria-live="polite">
      <div className="store-dashboard">
        <div className="store-actions">
          <div className="store-intro">
            <h2>{tab.label}</h2>
            <p className="tab-description">{tab.description}</p>
          </div>

          <button
            type="button"
            className="store-create-button"
            onClick={() => setIsCreatingStore(true)}
          >
            매장 만들기
          </button>
        </div>

        {isCreatingStore && (
          <form className="store-form" onSubmit={handleSubmit}>
            <div className="store-form-grid">
              <label className="store-field">
                <span>매장명</span>
                <input
                  type="text"
                  name="name"
                  value={formState.name}
                  onChange={handleChange}
                  placeholder="예: 서울 본점"
                />
                {errors.name && <p className="store-error">{errors.name}</p>}
              </label>

              <label className="store-field">
                <span>업종</span>
                <input
                  type="text"
                  name="industry"
                  value={formState.industry}
                  onChange={handleChange}
                  placeholder="예: F&B, 리테일 등"
                />
                {errors.industry && <p className="store-error">{errors.industry}</p>}
              </label>

              <label className="store-checkbox">
                <input
                  type="checkbox"
                  name="underFive"
                  checked={formState.underFive}
                  onChange={handleChange}
                />
                <span>상시근로자 5인 미만 사업장</span>
              </label>
            </div>

            <div className="store-form-actions">
              <button type="submit" disabled={submitting}>
                {submitting ? '등록 중...' : '매장 등록'}
              </button>
              <button type="button" className="button-secondary" onClick={handleCancel} disabled={submitting}>
                취소
              </button>
            </div>

            {submitError && <p className="store-error" role="alert">{submitError}</p>}
          </form>
        )}

        {storeError && !isCreatingStore && (
          <p className="store-error" role="alert">
            {storeError}
          </p>
        )}

        {!hasStores ? (
          <p className="store-empty">매장을 먼저 등록하세요.</p>
        ) : (
          <div className="store-overview">
            <div className="store-overview-header">
              <h3>{selectedStore?.name} 매장</h3>
              <p>
                업종: {selectedStore?.industry} · 상시근로자 5인 미만{' '}
                {selectedStore?.underFive ? '예' : '아니오'}
              </p>
            </div>

            <ul className="tab-list">
              {tab.highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
            <p className="tab-hint">* 해당 기능은 곧 구현될 예정입니다.</p>
          </div>
        )}
      </div>
    </section>
  );
};
