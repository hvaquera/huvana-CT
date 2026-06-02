'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  CheckCircle, ArrowRight, ArrowLeft, Eye, EyeOff,
  Loader2, Zap, Clock, GitBranch, Bot, Check
} from 'lucide-react';

// ─── Types ─────────────────────────────────────────────────────────────────
interface StepData {
  // Step 1 — PM Tool
  pmTool: 'jira' | 'asana' | '';
  jiraUrl: string;
  jiraEmail: string;
  jiraToken: string;
  asanaToken: string;
  asanaWorkspaceGid: string;
  // Step 2 — Time Tracking
  timeTool: 'harvest' | 'toggl' | 'tempo' | '';
  harvestToken: string;
  harvestAccountId: string;
  togglToken: string;
  togglWorkspaceId: string;
  // Step 3 — GitHub
  githubToken: string;
  githubOwner: string;
  // Step 4 — AI Copilot
  anthropicKey: string;
}

const STEPS = [
  { id: 1, label: 'Project Mgmt', icon: Zap,       desc: 'Connect Jira or Asana' },
  { id: 2, label: 'Time Tracking', icon: Clock,     desc: 'Connect Harvest or Toggl' },
  { id: 3, label: 'Code Repos',    icon: GitBranch, desc: 'Connect GitHub (optional)' },
  { id: 4, label: 'AI Copilot',    icon: Bot,       desc: 'Add Anthropic key (optional)' },
];

// ─── Small helpers ──────────────────────────────────────────────────────────
function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-sm font-medium text-gray-300 mb-1">
      {children}
    </label>
  );
}

function Input({
  type = 'text', value, onChange, placeholder, disabled,
}: {
  type?: string; value: string; onChange: (v: string) => void;
  placeholder?: string; disabled?: boolean;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white
                 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500
                 disabled:opacity-50 disabled:cursor-not-allowed"
    />
  );
}

function SecretInput({
  value, onChange, placeholder, disabled,
}: {
  value: string; onChange: (v: string) => void;
  placeholder?: string; disabled?: boolean;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        type={show ? 'text' : 'password'}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 pr-10 text-sm text-white
                   placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500
                   disabled:opacity-50 disabled:cursor-not-allowed"
      />
      <button
        type="button"
        onClick={() => setShow(s => !s)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
      >
        {show ? <EyeOff size={14} /> : <Eye size={14} />}
      </button>
    </div>
  );
}

// ─── Step components ────────────────────────────────────────────────────────
function Step1({
  data, set, onTest, testState,
}: {
  data: StepData;
  set: (k: keyof StepData, v: string) => void;
  onTest: () => void;
  testState: 'idle' | 'testing' | 'ok' | 'fail';
}) {
  return (
    <div className="space-y-5">
      <div>
        <Label>Choose your PM tool</Label>
        <div className="grid grid-cols-2 gap-3 mt-2">
          {(['jira', 'asana'] as const).map(tool => (
            <button
              key={tool}
              onClick={() => set('pmTool', tool)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all
                ${data.pmTool === tool
                  ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                  : 'border-gray-700 bg-gray-800/50 text-gray-400 hover:border-gray-500'}`}
            >
              {data.pmTool === tool && <Check size={14} />}
              {tool === 'jira' ? '🟦 Jira' : '🟪 Asana'}
            </button>
          ))}
        </div>
      </div>

      {data.pmTool === 'jira' && (
        <div className="space-y-3">
          <div>
            <Label>Jira Base URL</Label>
            <Input value={data.jiraUrl} onChange={v => set('jiraUrl', v)}
              placeholder="https://yourcompany.atlassian.net" />
          </div>
          <div>
            <Label>Jira Email</Label>
            <Input value={data.jiraEmail} onChange={v => set('jiraEmail', v)}
              placeholder="you@company.com" />
          </div>
          <div>
            <Label>Jira API Token</Label>
            <SecretInput value={data.jiraToken} onChange={v => set('jiraToken', v)}
              placeholder="Paste your Atlassian API token" />
            <p className="mt-1 text-xs text-gray-500">
              Generate at <a href="https://id.atlassian.com/manage-profile/security/api-tokens"
                target="_blank" rel="noopener noreferrer"
                className="text-blue-400 hover:underline">id.atlassian.com</a>
            </p>
          </div>
        </div>
      )}

      {data.pmTool === 'asana' && (
        <div className="space-y-3">
          <div>
            <Label>Asana Personal Access Token</Label>
            <SecretInput value={data.asanaToken} onChange={v => set('asanaToken', v)}
              placeholder="Paste your Asana PAT" />
            <p className="mt-1 text-xs text-gray-500">
              Generate at <a href="https://app.asana.com/0/my-apps"
                target="_blank" rel="noopener noreferrer"
                className="text-blue-400 hover:underline">app.asana.com/my-apps</a>
            </p>
          </div>
          <div>
            <Label>Workspace GID</Label>
            <Input value={data.asanaWorkspaceGid} onChange={v => set('asanaWorkspaceGid', v)}
              placeholder="e.g. 1214143190745883" />
          </div>
        </div>
      )}

      {data.pmTool && (
        <button
          onClick={onTest}
          disabled={testState === 'testing'}
          className={`flex items-center gap-2 text-sm px-4 py-2 rounded-lg transition-all
            ${testState === 'ok'   ? 'bg-green-600/20 text-green-400 border border-green-600/40' :
              testState === 'fail' ? 'bg-red-600/20 text-red-400 border border-red-600/40' :
              'bg-gray-700 hover:bg-gray-600 text-gray-200 border border-gray-600'}`}
        >
          {testState === 'testing' ? <Loader2 size={14} className="animate-spin" /> :
           testState === 'ok' ? <CheckCircle size={14} /> : null}
          {testState === 'testing' ? 'Testing…' :
           testState === 'ok'      ? 'Connected!' :
           testState === 'fail'    ? 'Connection failed — check credentials' :
           'Test Connection'}
        </button>
      )}
    </div>
  );
}

function Step2({
  data, set,
}: {
  data: StepData;
  set: (k: keyof StepData, v: string) => void;
}) {
  return (
    <div className="space-y-5">
      <div>
        <Label>Choose your time tracking tool</Label>
        <div className="grid grid-cols-3 gap-3 mt-2">
          {(['harvest', 'toggl', 'tempo'] as const).map(tool => (
            <button
              key={tool}
              onClick={() => set('timeTool', tool)}
              className={`flex items-center justify-center gap-1.5 px-3 py-3 rounded-xl border text-sm font-medium transition-all
                ${data.timeTool === tool
                  ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                  : 'border-gray-700 bg-gray-800/50 text-gray-400 hover:border-gray-500'}`}
            >
              {data.timeTool === tool && <Check size={12} />}
              {tool.charAt(0).toUpperCase() + tool.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {data.timeTool === 'harvest' && (
        <div className="space-y-3">
          <div>
            <Label>Harvest Access Token</Label>
            <SecretInput value={data.harvestToken} onChange={v => set('harvestToken', v)}
              placeholder="Paste your Harvest token" />
            <p className="mt-1 text-xs text-gray-500">
              Generate at <a href="https://id.getharvest.com/developers"
                target="_blank" rel="noopener noreferrer"
                className="text-blue-400 hover:underline">id.getharvest.com/developers</a>
            </p>
          </div>
          <div>
            <Label>Harvest Account ID</Label>
            <Input value={data.harvestAccountId} onChange={v => set('harvestAccountId', v)}
              placeholder="e.g. 2203031" />
          </div>
        </div>
      )}

      {data.timeTool === 'toggl' && (
        <div className="space-y-3">
          <div>
            <Label>Toggl API Token</Label>
            <SecretInput value={data.togglToken} onChange={v => set('togglToken', v)}
              placeholder="Paste your Toggl API token" />
          </div>
          <div>
            <Label>Toggl Workspace ID</Label>
            <Input value={data.togglWorkspaceId} onChange={v => set('togglWorkspaceId', v)}
              placeholder="e.g. 1234567" />
          </div>
        </div>
      )}

      {data.timeTool === 'tempo' && (
        <div className="rounded-lg bg-blue-900/20 border border-blue-700/40 p-3 text-sm text-blue-300">
          Tempo uses your Jira credentials — no extra token needed.
        </div>
      )}

      {!data.timeTool && (
        <p className="text-xs text-gray-500 italic">You can skip this step and add it later in Admin → Integrations.</p>
      )}
    </div>
  );
}

function Step3({
  data, set,
}: {
  data: StepData;
  set: (k: keyof StepData, v: string) => void;
}) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-400">
        Connect GitHub to see commit activity, open PRs, and repo health in your dashboard.
        This step is optional.
      </p>
      <div>
        <Label>GitHub Personal Access Token</Label>
        <SecretInput value={data.githubToken} onChange={v => set('githubToken', v)}
          placeholder="ghp_xxxxxxxxxxxxxxxxxxxx" />
        <p className="mt-1 text-xs text-gray-500">
          Generate at <a href="https://github.com/settings/tokens"
            target="_blank" rel="noopener noreferrer"
            className="text-blue-400 hover:underline">github.com/settings/tokens</a>
          {' '}— needs <code className="text-gray-300">repo</code> scope
        </p>
      </div>
      <div>
        <Label>GitHub Owner / Org</Label>
        <Input value={data.githubOwner} onChange={v => set('githubOwner', v)}
          placeholder="e.g. hvaquera or your-org" />
      </div>
    </div>
  );
}

function Step4({
  data, set,
}: {
  data: StepData;
  set: (k: keyof StepData, v: string) => void;
}) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-400">
        Add your Anthropic API key to unlock the AI Co-Pilot — proactive insights and natural language
        chat about your ops data. Optional but highly recommended.
      </p>
      <div>
        <Label>Anthropic API Key</Label>
        <SecretInput value={data.anthropicKey} onChange={v => set('anthropicKey', v)}
          placeholder="sk-ant-api03-xxxxxxxxxxxx" />
        <p className="mt-1 text-xs text-gray-500">
          Get your key at <a href="https://console.anthropic.com/settings/keys"
            target="_blank" rel="noopener noreferrer"
            className="text-blue-400 hover:underline">console.anthropic.com</a>
        </p>
      </div>
      <div className="rounded-xl bg-gradient-to-br from-purple-900/30 to-blue-900/30
                      border border-purple-700/40 p-4 space-y-2">
        <p className="text-sm font-medium text-purple-300">What AI Co-Pilot can do:</p>
        <ul className="text-xs text-gray-400 space-y-1">
          <li>✦ Spot overdue tasks and stale projects automatically</li>
          <li>✦ Summarize team velocity and workload distribution</li>
          <li>✦ Answer questions like "What's blocking the SAM1 project?"</li>
          <li>✦ Generate weekly ops digests for stakeholders</li>
        </ul>
      </div>
    </div>
  );
}

// ─── Main page ──────────────────────────────────────────────────────────────
export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [testState, setTestState] = useState<'idle' | 'testing' | 'ok' | 'fail'>('idle');

  const [data, setData] = useState<StepData>({
    pmTool: '',
    jiraUrl: '', jiraEmail: '', jiraToken: '',
    asanaToken: '', asanaWorkspaceGid: '',
    timeTool: '',
    harvestToken: '', harvestAccountId: '',
    togglToken: '', togglWorkspaceId: '',
    githubToken: '', githubOwner: '',
    anthropicKey: '',
  });

  const set = (k: keyof StepData, v: string) => setData(d => ({ ...d, [k]: v }));

  // Build payload for /api/admin/config
  const buildPayload = () => ({
    jiraUrl:          data.jiraUrl,
    jiraEmail:        data.jiraEmail,
    jiraToken:        data.jiraToken,
    asanaToken:       data.asanaToken,
    asanaWorkspaceGid:data.asanaWorkspaceGid,
    harvestToken:     data.harvestToken,
    harvestAccountId: data.harvestAccountId,
    togglToken:       data.togglToken,
    togglWorkspaceId: data.togglWorkspaceId,
    githubToken:      data.githubToken,
    githubOwner:      data.githubOwner,
    anthropicKey:     data.anthropicKey,
  });

  // Save current step's data and advance
  const handleNext = async () => {
    if (step < 4) {
      setSaving(true);
      try {
        await fetch('/api/admin/config', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(buildPayload()),
        });
      } catch { /* non-blocking */ }
      setSaving(false);
      setStep(s => s + 1);
      setTestState('idle');
    } else {
      // Final step — save and redirect
      setSaving(true);
      await fetch('/api/admin/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(buildPayload()),
      });
      setSaving(false);
      router.push('/');
    }
  };

  const handleTestConnection = async () => {
    setTestState('testing');
    try {
      if (data.pmTool === 'jira') {
        const res = await fetch('/api/jira');
        setTestState(res.ok ? 'ok' : 'fail');
      } else if (data.pmTool === 'asana') {
        const res = await fetch('/api/asana');
        setTestState(res.ok ? 'ok' : 'fail');
      }
    } catch {
      setTestState('fail');
    }
  };

  const canAdvance = () => {
    if (step === 1) return data.pmTool !== '';
    return true; // steps 2–4 are optional
  };

  const progress = ((step - 1) / (STEPS.length - 1)) * 100;

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-4">
      {/* Logo / Brand */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">CT</div>
          <span className="text-xl font-semibold text-white">Control Tower</span>
        </div>
        <p className="text-sm text-gray-400">Delivery Intelligence Platform</p>
      </div>

      {/* Card */}
      <div className="w-full max-w-lg bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl overflow-hidden">

        {/* Step progress bar */}
        <div className="relative h-1 bg-gray-800">
          <div
            className="absolute left-0 top-0 h-full bg-blue-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Step tabs */}
        <div className="flex border-b border-gray-800">
          {STEPS.map(s => {
            const Icon = s.icon;
            const done = step > s.id;
            const active = step === s.id;
            return (
              <div
                key={s.id}
                className={`flex-1 py-3 px-2 text-center transition-colors
                  ${active ? 'bg-gray-800/60' : 'bg-transparent'}
                  ${done ? 'opacity-60' : 'opacity-100'}`}
              >
                <div className={`flex items-center justify-center mb-0.5
                  ${active ? 'text-blue-400' : done ? 'text-green-400' : 'text-gray-600'}`}>
                  {done ? <CheckCircle size={14} /> : <Icon size={14} />}
                </div>
                <p className={`text-xs font-medium leading-tight
                  ${active ? 'text-gray-200' : done ? 'text-gray-400' : 'text-gray-600'}`}>
                  {s.label}
                </p>
              </div>
            );
          })}
        </div>

        {/* Step content */}
        <div className="p-6">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-white">
              {STEPS[step - 1].desc}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">Step {step} of {STEPS.length}</p>
          </div>

          {step === 1 && <Step1 data={data} set={set} onTest={handleTestConnection} testState={testState} />}
          {step === 2 && <Step2 data={data} set={set} />}
          {step === 3 && <Step3 data={data} set={set} />}
          {step === 4 && <Step4 data={data} set={set} />}
        </div>

        {/* Navigation */}
        <div className="px-6 pb-6 flex items-center justify-between">
          <button
            onClick={() => setStep(s => s - 1)}
            disabled={step === 1}
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-200
                       disabled:opacity-0 disabled:pointer-events-none transition-colors"
          >
            <ArrowLeft size={14} /> Back
          </button>

          <div className="flex items-center gap-3">
            {step < 4 && step !== 1 && (
              <button
                onClick={() => { setStep(s => s + 1); setTestState('idle'); }}
                className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
              >
                Skip
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={!canAdvance() || saving}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50
                         disabled:cursor-not-allowed text-white text-sm font-medium
                         px-5 py-2 rounded-lg transition-all"
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : null}
              {step === 4 ? 'Go to Dashboard' : 'Continue'}
              {step !== 4 && !saving && <ArrowRight size={14} />}
            </button>
          </div>
        </div>
      </div>

      {/* Already configured? */}
      <p className="mt-5 text-xs text-gray-600">
        Already set up?{' '}
        <a href="/" className="text-blue-400 hover:underline">Go to dashboard →</a>
      </p>
    </div>
  );
}