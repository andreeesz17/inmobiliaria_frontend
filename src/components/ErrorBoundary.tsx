import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
        errorInfo: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error, errorInfo: null };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Error Boundary caught an error:', error, errorInfo);
        this.setState({ errorInfo });
    }

    private handleReload = () => {
        window.location.reload();
    };

    private handleErrorReset = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
    };

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-background p-4">
                    <div className="max-w-md w-full rounded-2xl border border-border bg-card p-6 shadow-lg">
                        <div className="text-center space-y-4">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>

                            <div>
                                <h2 className="text-xl font-bold text-foreground">¡Ups! Algo salió mal</h2>
                                <p className="text-muted-foreground mt-2">
                                    Ocurrió un error inesperado en la aplicación.
                                </p>
                            </div>

                            {import.meta.env.DEV && this.state.error && (
                                <div className="text-left bg-muted rounded-lg p-4 text-sm">
                                    <p className="font-medium text-red-600 dark:text-red-400">Error de desarrollo:</p>
                                    <p className="text-muted-foreground mt-1 font-mono">{this.state.error.message}</p>
                                    {this.state.errorInfo && (
                                        <details className="mt-2">
                                            <summary className="cursor-pointer text-muted-foreground">Stack trace</summary>
                                            <pre className="mt-2 text-xs overflow-auto max-h-32">{this.state.errorInfo.componentStack}</pre>
                                        </details>
                                    )}
                                </div>
                            )}

                            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                                <button
                                    onClick={this.handleErrorReset}
                                    className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium"
                                >
                                    Intentar de nuevo
                                </button>
                                <button
                                    onClick={this.handleReload}
                                    className="px-4 py-2 rounded-lg border border-border bg-background text-foreground hover:bg-muted transition-colors font-medium"
                                >
                                    Recargar página
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export const useErrorHandler = () => {
    return (error: Error) => {
        throw error;
    };
};