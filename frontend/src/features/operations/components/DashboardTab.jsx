import { useState } from 'react';
import { WorkspaceSelect } from '../../../shared/components/WorkspaceSelect.jsx';
import { useWorkspace } from '../hooks/useWorkspace.js';

const INITIAL_FORM_STATE = {
  name: '',
  industry: '',
  underFive: false
};

export const DashboardTab = ({ tab }) => {
  const {
    workspaces,
    selectedWorkspace,
    selectedWorkspaceId,
    registerWorkspace,
    selectWorkspace,
    hasWorkspaces
  } = useWorkspace();
  const [isCreatingWorkspace, setIsCreatingWorkspace] = useState(false);
  const [formState, setFormState] = useState(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState({});

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
    setIsCreatingWorkspace(false);
    resetForm();
  };

  const handleSubmit = (event) => {
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

    registerWorkspace({
      name: trimmedName,
      industry: trimmedIndustry,
      underFive: formState.underFive
    });

    setIsCreatingWorkspace(false);
    resetForm();
  };

  return (
    <section className="tab-panel" aria-live="polite">
      <div className="workspace-dashboard">
        <div className="workspace-actions">
          <div className="workspace-intro">
            <h2>{tab.label}</h2>
            <p className="tab-description">{tab.description}</p>
          </div>

          <WorkspaceSelect
            workspaces={workspaces}
            selectedWorkspaceId={selectedWorkspaceId}
            onChange={selectWorkspace}
          />

          <button
            type="button"
            className="workspace-create-button"
            onClick={() => setIsCreatingWorkspace(true)}
          >
            워크스페이스 만들기
          </button>
        </div>

        {isCreatingWorkspace && (
          <form className="workspace-form" onSubmit={handleSubmit}>
            <div className="workspace-form-grid">
              <label className="workspace-field">
                <span>매장명</span>
                <input
                  type="text"
                  name="name"
                  value={formState.name}
                  onChange={handleChange}
                  placeholder="예: 서울 본점"
                />
                {errors.name && <p className="workspace-error">{errors.name}</p>}
              </label>

              <label className="workspace-field">
                <span>업종</span>
                <input
                  type="text"
                  name="industry"
                  value={formState.industry}
                  onChange={handleChange}
                  placeholder="예: F&B, 리테일 등"
                />
                {errors.industry && <p className="workspace-error">{errors.industry}</p>}
              </label>

              <label className="workspace-checkbox">
                <input
                  type="checkbox"
                  name="underFive"
                  checked={formState.underFive}
                  onChange={handleChange}
                />
                <span>상시근로자 5인 미만 사업장</span>
              </label>
            </div>

            <div className="workspace-form-actions">
              <button type="submit">워크스페이스 등록</button>
              <button type="button" className="button-secondary" onClick={handleCancel}>
                취소
              </button>
            </div>
          </form>
        )}

        {!hasWorkspaces ? (
          <p className="workspace-empty">워크스페이스를 먼저 등록하세요.</p>
        ) : (
          <div className="workspace-overview">
            <div className="workspace-overview-header">
              <h3>{selectedWorkspace?.name} 워크스페이스</h3>
              <p>
                업종: {selectedWorkspace?.industry} · 상시근로자 5인 미만{' '}
                {selectedWorkspace?.underFive ? '예' : '아니오'}
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
