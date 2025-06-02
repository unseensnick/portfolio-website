export function Footer({ copyright }) {
    return (
        <footer className="border-t border-border">
            <div className="max-w-6xl mx-auto px-8 py-12 text-center text-sm text-muted-foreground">
                {copyright}
            </div>
        </footer>
    );
}
