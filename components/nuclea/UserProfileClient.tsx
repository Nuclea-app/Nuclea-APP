"use client";

import { useState } from "react";
import {
  Mail,
  Lock,
  User,
  Calendar,
  Globe,
  ChevronRight,
  Pencil,
  X,
  Eye,
  EyeOff,
  Send,
  LogOut,
} from "lucide-react";
import { Calendar as CalendarPicker } from "@/components/ui/calendar";
import { es } from "date-fns/locale";
import {
  updateUserName,
  updateUserPassword,
  updateUserBirthdate,
} from "@/lib/actions/user.actions";
import { signOut } from "next-auth/react";

interface UserProfileClientProps {
  userId: string;
  name: string;
  email: string;
  birthdate: Date | null;
  hasPassword: boolean;
  capsulesCreated: number;
  capsulesDelivered: number;
}

type EditField = "nombre" | "contraseña" | "fecha" | null;

export const UserProfileClient = ({
  userId,
  name: initialName,
  email,
  birthdate: initialBirthdate,
  hasPassword,
  capsulesCreated,
  capsulesDelivered,
}: UserProfileClientProps) => {
  const [name, setName] = useState(initialName);
  const [birthdate, setBirthdate] = useState<Date | null>(initialBirthdate);
  const [editField, setEditField] = useState<EditField>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  // Nombre
  const [tempName, setTempName] = useState(initialName);

  // Contraseña
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [showCurrentPwd, setShowCurrentPwd] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [userHasPassword, setUserHasPassword] = useState(hasPassword);

  const openEdit = (field: EditField) => {
    setError("");
    setTempName(name);
    setCurrentPwd("");
    setNewPwd("");
    setConfirmPwd("");
    setEditField(field);
  };

  const closeEdit = () => {
    setEditField(null);
    setError("");
  };

  const saveName = async () => {
    setIsSaving(true);
    const res = await updateUserName(userId, tempName);
    setIsSaving(false);
    if ("error" in res) { setError(res.error ?? ""); return; }
    setName(res.name!);
    closeEdit();
  };

  const savePassword = async () => {
    if (newPwd !== confirmPwd) { setError("Las contraseñas no coinciden"); return; }
    if (newPwd.length < 8) { setError("Mínimo 8 caracteres"); return; }
    setIsSaving(true);
    const res = await updateUserPassword(userId, currentPwd, newPwd);
    setIsSaving(false);
    if ("error" in res) { setError(res.error ?? ""); return; }
    setUserHasPassword(true);
    closeEdit();
  };

  const saveBirthdate = async (date: Date) => {
    setBirthdate(date);
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    await updateUserBirthdate(userId, `${y}-${m}-${d}`);
    closeEdit();
  };

  const formatBirthdate = (d: Date | null) => {
    if (!d) return null;
    return new Date(d).toLocaleDateString("es-ES", {
      day: "numeric", month: "long", year: "numeric",
    });
  };

  const initial = (name || email || "?").charAt(0).toUpperCase();

  const rows = [
    { id: "email",     icon: Mail,     label: "Email",               value: email,               editable: false },
    { id: "contraseña",icon: Lock,     label: "Contraseña",          value: userHasPassword ? "••••••••" : "Añadir contraseña", editable: true },
    { id: "nombre",    icon: User,     label: "Nombre",              value: name || "Mi nombre", editable: true },
    { id: "fecha",     icon: Calendar, label: "Fecha de nacimiento", value: formatBirthdate(birthdate) ?? "—", editable: true },
    { id: "idioma",    icon: Globe,    label: "Idioma",              value: "Español",            editable: false },
  ] as const;

  return (
    <>
      <div className="flex flex-col pb-24 px-6 min-h-screen">
        {/* Avatar */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-4">
            <div className="h-[100px] w-[100px] rounded-full bg-surface flex items-center justify-center border border-border">
              <span className="font-serif text-4xl text-foreground/30">{initial}</span>
            </div>
            <button className="absolute bottom-1 right-1 h-8 w-8 rounded-full bg-foreground text-background flex items-center justify-center border-2 border-background shadow-sm">
              <Pencil className="h-3.5 w-3.5" />
            </button>
          </div>
          <h1 className="font-serif text-3xl text-foreground">{name || "Mi perfil"}</h1>
          <p className="text-[13px] text-foreground/40 mt-1">Aquí se guarda tu historia.</p>
        </div>

        {/* Datos personales */}
        <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-foreground mb-3">
          DATOS PERSONALES
        </p>
        <div className="rounded-2xl border border-border bg-background overflow-hidden mb-8">
          {rows.map((row, i) => {
            const Icon = row.icon;
            const isLast = i === rows.length - 1;
            return (
              <button
                key={row.id}
                disabled={!row.editable}
                onClick={() => row.editable && openEdit(row.id as EditField)}
                className={`w-full flex items-center gap-3 px-4 py-4 text-left transition-colors ${!isLast ? "border-b border-border" : ""} ${row.editable ? "hover:bg-surface active:bg-surface/50" : "opacity-60 cursor-default"}`}
              >
                <Icon className="h-4 w-4 text-foreground/30 shrink-0" strokeWidth={1.5} />
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-foreground">{row.label}</p>
                  <p className="text-[12px] text-foreground/40 truncate">{row.value}</p>
                </div>
                {row.editable && <ChevronRight className="h-4 w-4 text-foreground/20 shrink-0" />}
              </button>
            );
          })}
        </div>

        {/* Stats */}
        <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-foreground mb-3">
          MIS CÁPSULAS
        </p>
        <div className="grid grid-cols-2 gap-3 mb-10">
          {[
            { icon: Pencil, count: capsulesCreated, label: "Cápsulas creadas" },
            { icon: Send, count: capsulesDelivered, label: "Cápsulas enviadas" },
          ].map(({ icon: Icon, count, label }) => (
            <div key={label} className="rounded-2xl border border-border bg-background p-4 flex flex-col gap-3">
              {/* Icon + number side by side */}
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-surface flex items-center justify-center shrink-0">
                  <Icon className="h-4 w-4 text-foreground/40" strokeWidth={1.5} />
                </div>
                <span className="font-serif text-4xl text-foreground leading-none">{count}</span>
              </div>
              <p className="text-[11px] text-foreground/40">{label}</p>
            </div>
          ))}
        </div>

        {/* Logout */}
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="w-full flex items-center justify-center gap-2 rounded-2xl border border-red-200 py-4 text-[12px] font-semibold tracking-wider text-red-400 transition-all hover:bg-red-50 active:scale-[0.98]"
        >
          <LogOut className="h-4 w-4" />
          <span>CERRAR SESIÓN</span>
        </button>
      </div>

      {/* ── Edit Drawers ── */}

      {/* Nombre */}
      {editField === "nombre" && (
        <EditDrawer title="Cambiar nombre" onClose={closeEdit} onSave={saveName} isSaving={isSaving} error={error}>
          <input
            autoFocus
            type="text"
            value={tempName}
            onChange={(e) => setTempName(e.target.value)}
            placeholder="Tu nombre"
            className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-[15px] text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-foreground/40 transition-colors"
          />
        </EditDrawer>
      )}

      {/* Contraseña */}
      {editField === "contraseña" && (
        <EditDrawer title={userHasPassword ? "Cambiar contraseña" : "Añadir contraseña"} onClose={closeEdit} onSave={savePassword} isSaving={isSaving} error={error}>
          <div className="space-y-3">
            {userHasPassword && (
              <div className="relative">
                <input
                  type={showCurrentPwd ? "text" : "password"}
                  value={currentPwd}
                  onChange={(e) => setCurrentPwd(e.target.value)}
                  placeholder="Contraseña actual"
                  className="w-full rounded-2xl border border-border bg-background px-4 py-3 pr-11 text-[15px] text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-foreground/40 transition-colors"
                />
                <button type="button" onClick={() => setShowCurrentPwd(!showCurrentPwd)} className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/30">
                  {showCurrentPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            )}
            <div className="relative">
              <input
                type={showNewPwd ? "text" : "password"}
                value={newPwd}
                onChange={(e) => setNewPwd(e.target.value)}
                placeholder="Nueva contraseña"
                className="w-full rounded-2xl border border-border bg-background px-4 py-3 pr-11 text-[15px] text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-foreground/40 transition-colors"
              />
              <button type="button" onClick={() => setShowNewPwd(!showNewPwd)} className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/30">
                {showNewPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <input
              type="password"
              value={confirmPwd}
              onChange={(e) => setConfirmPwd(e.target.value)}
              placeholder="Confirmar contraseña"
              className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-[15px] text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-foreground/40 transition-colors"
            />
          </div>
        </EditDrawer>
      )}

      {/* Fecha de nacimiento — inline calendar, no popover */}
      {editField === "fecha" && (
        <EditDrawer title="Fecha de nacimiento" onClose={closeEdit} hideSave>
          <div className="flex justify-center">
            <CalendarPicker
              mode="single"
              locale={es}
              selected={birthdate ?? undefined}
              captionLayout="dropdown"
              fromYear={1920}
              toYear={new Date().getFullYear()}
              onSelect={(d) => d && saveBirthdate(d)}
              className="rounded-2xl border border-border p-2"
            />
          </div>
        </EditDrawer>
      )}
    </>
  );
};

// ─── Edit Drawer ─────────────────────────────────────────────────────────────
interface EditDrawerProps {
  title: string;
  onClose: () => void;
  onSave?: () => void;
  isSaving?: boolean;
  error?: string;
  hideSave?: boolean;
  children: React.ReactNode;
}

const EditDrawer = ({ title, onClose, onSave, isSaving, error, hideSave, children }: EditDrawerProps) => (
  <div className="fixed inset-0 z-[70] flex flex-col justify-end">
    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
    <div className="relative bg-background rounded-t-[32px] px-6 pt-6 pb-12 max-w-[430px] w-full mx-auto shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-serif text-xl text-foreground">{title}</h3>
        <button onClick={onClose} className="p-2 rounded-full hover:bg-surface">
          <X className="h-5 w-5 text-foreground/40" />
        </button>
      </div>

      {children}

      {error && (
        <p className="mt-3 text-[13px] text-red-500 text-center">{error}</p>
      )}

      {!hideSave && (
        <button
          onClick={onSave}
          disabled={isSaving}
          className="mt-5 w-full rounded-2xl bg-foreground text-background py-4 text-[12px] font-semibold tracking-wider transition-all hover:opacity-90 disabled:opacity-40"
        >
          {isSaving ? "GUARDANDO..." : "GUARDAR"}
        </button>
      )}
    </div>
  </div>
);
