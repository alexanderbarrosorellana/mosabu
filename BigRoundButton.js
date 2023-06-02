import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Pressable,
} from 'react-native';

import {Button, ActivityIndicator, MD2Colors} from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import {useQuery} from '@tanstack/react-query';
import {getIteration, generateIteration, baseApi} from './mosabuApi';

const BigRoundButton = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [showEnv, setShowEnv] = useState(false);
  const {data, error, refetch, remove, isLoading, isFetching} = useQuery({
    queryKey: ['generateIteration'],
    queryFn: generateIteration,
    enabled: false,
  });

  const {
    data: iterationData,
    error: iterationError,
    refetch: iterationRefetch,
    isFetching: iterationIsFetching,
    remove: iterationRemove,
  } = useQuery({
    queryKey: ['getIteration'],
    queryFn: getIteration,
  });

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      iterationRemove();
      iterationRefetch();
      remove();
      setRefreshing(false);
    }, 2000);
  }, [iterationRefetch, remove, iterationRemove]);

  const handleGeneratePress = () => refetch();

  const buttonText = () => {
    if (isFetching && isLoading) {
      return 'Generando';
    } else if (data) {
      return 'Generado';
    } else {
      return 'Generar';
    }
  };

  return (
    <SafeAreaView style={styles.fullScreen}>
      <ScrollView
        contentContainerStyle={styles.fullScreen}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <View style={styles.container}>
          <View style={styles.titleContainer}>
            {showEnv && (
              <Text style={styles.text}>{`${
                process.env.NODE_ENV.charAt(0).toUpperCase() +
                process.env.NODE_ENV.slice(1)
              }\n\n ${baseApi()}\n`}</Text>
            )}
            <Text style={styles.text}>¡Hola!</Text>
            <Pressable
              delayLongPress={3000}
              onLongPress={() => setShowEnv(!showEnv)}>
              <Text style={styles.iterationTitle}>Intercambio</Text>
            </Pressable>
            <View style={styles.iterationContent}>
              <Text style={styles.iterationNumber}>
                {iterationData && iterationData.iteration_number}
                {iterationIsFetching && !iterationData && (
                  <ActivityIndicator
                    animating={true}
                    color={MD2Colors.purple200}
                  />
                )}
              </Text>
            </View>
            <Text style={styles.textInfo}>
              Presiona el botón para asignar el nuevo intercambio.
            </Text>
            {data && (
              <Text style={styles.textSuccess}>
                Se han generado las asignaciones 🎉, desliza hacia abajo ⬇️ para
                volver al inicio.
              </Text>
            )}

            {(iterationError || error) && (
              <>
                <Text style={styles.textSuccess}>
                  {`Hubo un error ❌ ☠️ 😭 ${
                    iterationError
                      ? 'obteniendo el intercambio actual'
                      : 'generando las asignaciones'
                  }, desliza hacia abajo ⬇️ para volver al inicio`}
                </Text>
                <Text style={styles.errorDetails}>{`Detalle: ${
                  error ? error : iterationError
                }`}</Text>
              </>
            )}
          </View>
          <View style={styles.buttonContainer}>
            <LinearGradient
              colors={
                isFetching && isLoading
                  ? ['#D2D2D2', '#2D2D2D']
                  : ['#D6C1FF', '#9121d1']
              }
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
              style={styles.gradient}>
              <Button
                onPress={handleGeneratePress}
                loading={isFetching && isLoading}
                mode="text"
                labelStyle={styles.buttonText}
                contentStyle={styles.buttonContent}
                disabled={isFetching && isLoading}>
                {buttonText()}
              </Button>
            </LinearGradient>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 40,
  },
  fullScreen: {flex: 1},
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  textInfo: {
    marginTop: 30,
    textAlign: 'center',
  },
  iterationTitle: {
    marginTop: 30,
    textAlign: 'center',
    fontSize: 16,
  },
  iterationNumber: {
    marginTop: 7,
    fontWeight: 'bold',
    textAlign: 'center',
    alignItems: 'center',
    fontSize: 16,
  },
  textSuccess: {
    marginTop: 50,
    marginHorizontal: 50,
    textAlign: 'center',
  },
  titleContainer: {marginTop: 100},
  buttonContainer: {
    borderRadius: 100,
    width: 200,
    height: 200,
    overflow: 'hidden',
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    lineHeight: 25,
  },
  buttonContent: {
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  errorDetails: {
    marginHorizontal: 30,
    marginTop: 10,
    textAlign: 'center',
    fontSize: 10,
    color: 'gray',
  },
  iterationContent: {
    alignItems: 'center',
  },
});

export default BigRoundButton;
