import { useEffect, useState } from "react";
import "./TrustedContacts.css";
import {
    getContactsApi,
    createContactApi,
    deleteContactApi,
    updateContactApi,
} from "../../api/contactApi";

const TrustedContacts = () => {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [formError, setFormError] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        relation: "",
        isPrimary: false,
    });

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            setError("");
            try {
                const res = await getContactsApi();
                setContacts(Array.isArray(res.data) ? res.data : []);
            } catch (err) {
                setError(
                    err?.response?.data?.message || "Unable to load trusted contacts."
                );
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const handleChange = (e) => {
        setFormError("");
        setSuccessMsg("");
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError("");
        setSuccessMsg("");

        if (!form.name) {
            setFormError("Name is required");
            return;
        }
        if (!form.email && !form.phone) {
            setFormError("At least email or phone is required");
            return;
        }

        setSaving(true);
        try {
            const res = await createContactApi(form);
            setContacts((prev) => [res.data, ...prev]);
            setForm({
                name: "",
                email: "",
                phone: "",
                relation: "",
                isPrimary: false,
            });
            setSuccessMsg("Trusted contact added.");
        } catch (err) {
            setFormError(
                err?.response?.data?.message || "Failed to add contact. Please try again."
            );
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        const ok = window.confirm("Remove this trusted contact?");
        if (!ok) return;

        try {
            await deleteContactApi(id);
            setContacts((prev) => prev.filter((c) => c._id !== id));
        } catch (err) {
            alert(
                err?.response?.data?.message || "Failed to delete contact. Please try again."
            );
        }
    };

    const togglePrimary = async (contact) => {
        try {
            const res = await updateContactApi(contact._id, {
                isPrimary: !contact.isPrimary,
            });
            const updated = res.data;
            setContacts((prev) =>
                prev.map((c) => (c._id === updated._id ? updated : c))
            );
        } catch (err) {
            alert(
                err?.response?.data?.message ||
                "Failed to update primary contact. Please try again."
            );
        }
    };

    return (
        <main className="sr-page">
            <section className="sr-page-header">
                <div>
                    <h1>Trusted Contacts</h1>
                    <p>
                        These contacts will receive alerts when you trigger SOS
                        (in the full deployment with SMS/email integration).
                    </p>
                </div>
            </section>

            <section className="sr-page-grid">
                {/* LEFT: form */}
                <div className="sr-card sr-contacts-form-card">
                    <h2>Add new contact</h2>

                    <form className="sr-contacts-form" onSubmit={handleSubmit}>
                        <div className="sr-auth-field">
                            <label htmlFor="name">Full name</label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                placeholder="e.g. Mom"
                                value={form.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="sr-auth-field">
                            <label htmlFor="relation">Relation (optional)</label>
                            <input
                                id="relation"
                                name="relation"
                                type="text"
                                placeholder="Mother, Father, Friend..."
                                value={form.relation}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="sr-auth-field">
                            <label htmlFor="email">Email (optional)</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="contact@example.com"
                                value={form.email}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="sr-auth-field">
                            <label htmlFor="phone">Phone (optional)</label>
                            <input
                                id="phone"
                                name="phone"
                                type="text"
                                placeholder="+91 9xxxxxxxxx"
                                value={form.phone}
                                onChange={handleChange}
                            />
                        </div>

                        <label className="sr-checkbox">
                            <input
                                type="checkbox"
                                name="isPrimary"
                                checked={form.isPrimary}
                                onChange={handleChange}
                            />
                            <span>Mark as primary contact</span>
                        </label>

                        {formError && (
                            <p className="sr-error-text">{formError}</p>
                        )}
                        {successMsg && (
                            <p className="sr-success-text">{successMsg}</p>
                        )}

                        <button
                            type="submit"
                            className="sr-auth-submit"
                            disabled={saving}
                        >
                            {saving ? "Saving..." : "Save contact"}
                        </button>
                    </form>
                </div>

                {/* RIGHT: list */}
                <div className="sr-card sr-contacts-list-card">
                    <h2>Your contacts</h2>

                    {loading && <p>Loading contacts…</p>}
                    {error && <p className="sr-error-text">{error}</p>}

                    {!loading && !error && contacts.length === 0 && (
                        <p className="sr-muted">
                            No trusted contacts yet. Add at least one so SOS alerts know
                            whom to notify.
                        </p>
                    )}

                    <ul className="sr-contacts-list">
                        {contacts.map((c) => (
                            <li key={c._id} className="sr-contact-item">
                                <div className="sr-contact-main">
                                    <div className="sr-contact-name-row">
                                        <span className="sr-contact-name">{c.name}</span>
                                        {c.isPrimary && (
                                            <span className="sr-contact-primary-pill">
                                                Primary
                                            </span>
                                        )}
                                    </div>
                                    {c.relation && (
                                        <div className="sr-contact-relation">
                                            {c.relation}
                                        </div>
                                    )}
                                    <div className="sr-contact-details">
                                        {c.email && <span>{c.email}</span>}
                                        {c.phone && <span>{c.phone}</span>}
                                    </div>
                                </div>
                                <div className="sr-contact-actions">
                                    <button
                                        type="button"
                                        className="sr-small-btn"
                                        onClick={() => togglePrimary(c)}
                                    >
                                        {c.isPrimary ? "Unset primary" : "Make primary"}
                                    </button>
                                    <button
                                        type="button"
                                        className="sr-small-btn sr-small-btn-danger"
                                        onClick={() => handleDelete(c._id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>
        </main>
    );
};

export default TrustedContacts;
