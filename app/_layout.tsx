// app/_layout.tsx
import { Slot, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider, useAuth } from '../src/contexts/AuthContext';

// Componente que lida com a lógica de redirecionamento
const InitialLayout = () => {
  const { authenticated, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return; // Não faça nada enquanto o estado de auth está sendo carregado

    const inAuthGroup = segments[0] === '(auth)';

    if (authenticated && inAuthGroup) {
      // Se o usuário está logado e na tela de login, redirecione para a home
      router.replace('/(tabs)');
    } else if (!authenticated && !inAuthGroup) {
      // Se o usuário não está logado e NÃO está na tela de login, redirecione para o login
      router.replace('/(auth)/login');
    }
  }, [authenticated, isLoading, segments]);

  if (isLoading) {
    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><ActivityIndicator size="large" /></View>;
  }

  return <Slot />; // Slot renderiza a rota filha atual (seja do grupo auth ou tabs)
};

// Layout Raiz
export default function RootLayout() {
  return (
    <AuthProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <InitialLayout />
      </GestureHandlerRootView>
    </AuthProvider>
  );
}
