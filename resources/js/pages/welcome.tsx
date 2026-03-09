import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome({ canRegister = true }: { canRegister?: boolean }) {
    const { auth } = usePage<{ auth: { user?: { role?: string } } }>().props;

    return (
        <>
            <Head title="StageConnect — Find your perfect internship">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700" rel="stylesheet" />
            </Head>
            <div className="min-h-screen bg-background text-foreground" style={{ fontFamily: 'Instrument Sans, sans-serif' }}>
                {/* Header */}
                <header className="border-b">
                    <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
                        <span className="text-xl font-bold">Stage<span className="text-primary">Connect</span></span>
                        <nav className="flex items-center gap-4">
                            <Link href="/offers" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Browse Offers</Link>
                            {auth.user ? (
                                <Link href="/dashboard" className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Log in</Link>
                                    {canRegister && (
                                        <Link href="/register" className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
                                            Get started
                                        </Link>
                                    )}
                                </>
                            )}
                        </nav>
                    </div>
                </header>

                {/* Hero */}
                <section className="max-w-5xl mx-auto px-6 py-24 text-center">
                    <div className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs text-muted-foreground mb-8">
                        🎓 The internship platform for students &amp; companies
                    </div>
                    <h1 className="text-5xl font-bold leading-tight mb-6">
                        Find your perfect<br />
                        <span className="text-primary">internship</span> or <span className="text-primary">apprenticeship</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
                        StageConnect uses smart matching to connect students with companies — based on skills, location, availability and more.
                    </p>
                    <div className="flex gap-4 justify-center">
                        {canRegister && !auth.user && (
                            <Link href="/register" className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">
                                Create free account
                            </Link>
                        )}
                        <Link href="/offers" className="rounded-lg border px-6 py-3 text-sm font-semibold hover:bg-accent transition-colors">
                            Browse offers
                        </Link>
                    </div>
                </section>

                {/* Features */}
                <section className="border-t bg-muted/30">
                    <div className="max-w-5xl mx-auto px-6 py-20 grid gap-8 sm:grid-cols-3">
                        {[
                            { icon: '🎯', title: 'Smart Matching', desc: 'Our algorithm scores each offer against your skills, level, city and availability — so you only see relevant opportunities.' },
                            { icon: '💬', title: 'Direct Messaging', desc: 'Communicate directly with companies inside each application. No email back-and-forth.' },
                            { icon: '⭐', title: 'Verified Reviews', desc: 'After an accepted internship, both parties can leave honest reviews to build trust on the platform.' },
                        ].map(f => (
                            <div key={f.title} className="rounded-xl border bg-background p-6">
                                <div className="text-3xl mb-3">{f.icon}</div>
                                <h3 className="font-semibold mb-2">{f.title}</h3>
                                <p className="text-sm text-muted-foreground">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* CTA */}
                {!auth.user && canRegister && (
                    <section className="max-w-5xl mx-auto px-6 py-20 text-center">
                        <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
                        <p className="text-muted-foreground mb-8">Join thousands of students and companies already on StageConnect.</p>
                        <div className="flex gap-4 justify-center">
                            <Link href="/register" className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">
                                I'm a student →
                            </Link>
                            <Link href="/register" className="rounded-lg border px-6 py-3 text-sm font-semibold hover:bg-accent transition-colors">
                                I'm a company →
                            </Link>
                        </div>
                    </section>
                )}

                {/* Footer */}
                <footer className="border-t">
                    <div className="max-w-5xl mx-auto px-6 py-8 flex items-center justify-between text-xs text-muted-foreground">
                        <span>© 2026 StageConnect. All rights reserved.</span>
                        <span>Built with Laravel &amp; React</span>
                    </div>
                </footer>
            </div>
        </>
    );
}
