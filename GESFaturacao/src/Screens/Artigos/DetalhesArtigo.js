import React from 'react';
import {useState, useEffect, useContext} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  ScrollView,
  Button,
  TouchableOpacity,
  ToastAndroid,
  useColorScheme,
  ActivityIndicator
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import { Picker } from '@react-native-picker/picker';
import {AuthContext} from '../../Context/AuthContext';
import LinearGradient from 'react-native-linear-gradient';

export default function DetalhesArtigo({ route, navigation }) {
  const colorScheme = useColorScheme();
  const styles = getStyles(colorScheme);

  const [loading, setLoading] = useState(true);
  const { artigoId } = route.params;
  const { EditarArtigo, getArtigoID, getCategorias, getIVA } = useContext(AuthContext);
  
  const [locked, setLocked] = useState();
  const [isEditing, setIsEditing] = useState(false);

  const [dadosCategorias, setDadosCategorias] = useState([]);
  const [selectedIdCategory, setSelectedIdCategory] = useState(null);
  const [category, setCategory] = useState(null);
  const [dadosIvas, setDadosIvas] = useState([]);
  const [selectedIdIva, setSelectedIdIva] = useState(null);
  const [iva, setIva] = useState(null);

  const [code, setCode] = useState();
  const [name, setName] = useState();
  const [type, setType] = useState();
  const [unit, setUnit] = useState();
  const [qtdStock, setQtdStock] = useState();
  const [qtdStockMin, setQtdStockMin] = useState();
  const [pvp, setPvp] = useState();
  const [precoUnit, setPrecoUnit] = useState();
  const [precoIni, setPrecoIni] = useState();
  const [stockMin, setStockMin] = useState(false);

  const [serialNumber, setSerialNumber] = useState();
  const [retentionValue, setRetentionValue] = useState();
  const [retentionPercentage, setRetentionPercentage] = useState();
  const [calculateMarginUnitaryArticle, setCalculateMarginUnitaryArticle] = useState();
  const [profitMargin, setProfitMargin] = useState();
  const [exemptionReason, setExemptionReason] = useState();  
  const [observations, setObservations] = useState();
  const [label, setLabel] = useState();
  const [image, setImage] = useState();

  useEffect(() => {
    getArtigoID(artigoId)
      .then(async fetchedArtigo => {
        if (fetchedArtigo && fetchedArtigo.data) {
          try {
            const categoryResponse = await getCategorias();
            const ivaResponse = await getIVA();

            // console.log('Categorias: ', categoryResponse.data);
  
            setCode(fetchedArtigo.data.code);
            setName(fetchedArtigo.data.description); // changed from .name to .description
            setType(fetchedArtigo.data.type);
            setUnit(fetchedArtigo.data.unity); // changed from .unit to .unity
            setQtdStock(fetchedArtigo.data.stock); // changed from .qtdStock to .stock
            setQtdStockMin(fetchedArtigo.data.minStock); // changed from .qtdStockMin to .minStock
            setStockMin(fetchedArtigo.data.stockAlert); // changed from .stockMin to .stockAlert
            setPvp(fetchedArtigo.data.pricePvp); // changed from .pvp to .pricePvp
            setPrecoUnit(fetchedArtigo.data.price); // changed from .precoUnit to .price
            setPrecoIni(fetchedArtigo.data.initialPrice); // changed from .precoIni to .initialPrice
            setCategory(fetchedArtigo.data.category); 
            setIva(fetchedArtigo.data.taxID); // changed from .iva to .taxID
            setSelectedIdCategory(fetchedArtigo.data.category);
            setSelectedIdIva(fetchedArtigo.data.taxID); // changed from .iva to .taxID
            setLocked(fetchedArtigo.data.locked);
            setSerialNumber(fetchedArtigo.data.serialNumber);
            setRetentionValue(fetchedArtigo.data.retentionValue);
            setRetentionPercentage(fetchedArtigo.data.retentionPercentage);
            setCalculateMarginUnitaryArticle(fetchedArtigo.data.calculateMarginUnitaryArticle);
            setProfitMargin(fetchedArtigo.data.profitMargin);
            setExemptionReason(fetchedArtigo.data.exemptionReason);
            setObservations(fetchedArtigo.data.observations);
            setLabel(fetchedArtigo.data.label);
            setImage(fetchedArtigo.data.image);

            console.log('Image: ', fetchedArtigo.data.image);
            console.log('Artigo: ', fetchedArtigo.data);
            if (categoryResponse.data) {
              setDadosCategorias(categoryResponse.data);
              const selectedCategory = categoryResponse.data.find(category => {
                const categoryName = category.name;
                const fetchedCategoryName = fetchedArtigo.data.category;
                return categoryName && fetchedCategoryName && categoryName.toUpperCase() === fetchedCategoryName.toUpperCase();
              });
              if (selectedCategory) {
                setSelectedIdCategory(selectedCategory.id);
              } else {
                console.error('Category not found:', fetchedArtigo.data.category);
              }
            }
            if (ivaResponse.data) {
              setDadosIvas(ivaResponse.data);
              const selectedIva = ivaResponse.data.find(iva => iva.id === fetchedArtigo.data.taxID);
              if (selectedIva) {
                setSelectedIdIva(selectedIva.id);
              } else {
                console.error('IVA not found:', fetchedArtigo.data.taxID);
              }
            }
          } catch (error) {
            console.error(error);
          }
          setLoading(false);
        } else {
          console.error('Artigo indedifido ou não encontrado');
        }
      })
      .catch(error => {
        console.error('Erro no artigo:', error);
      });
  }, [artigoId]);
  
  const handleConfirmarEditar = async () => {    
    console.log('Image about to be sent: ', image);
    EditarArtigo(
      artigoId,
      code,
      name,
      selectedIdCategory,
      type,
      qtdStock,
      qtdStockMin,
      stockMin,
      unit,
      pvp,
      iva,
      precoUnit,     
      serialNumber,
      retentionValue,
      retentionPercentage,
      exemptionReason,
      observations,
      label,
      calculateMarginUnitaryArticle,
      profitMargin,      
      image,
      precoIni,
    ).then(response => {
      navigation.navigate('Dashboard');
      ToastAndroid.show("Artigo Editado", ToastAndroid.SHORT);
    }).catch(error => {
      console.error('Erro ao editar Artigo:', error);
      ToastAndroid.show('Erro ao editar Artigo', ToastAndroid.SHORT);
    });
  }
  
  // Loading indicator
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colorScheme === 'dark' ? '#333333' : '#ffffff' }}>
        <ActivityIndicator size="large" color={colorScheme === 'dark' ? '#ffffff' : '#d0933f'} />
      </View>
    );
  }

  const CustomButton = ({ title, onPress, styles, gradientColors }) => (
    <TouchableOpacity onPress={onPress}>
      <LinearGradient
        colors={gradientColors}
        style={[styles.button]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Text style={styles.buttonText}>{title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <ScrollView>
    <View style={styles.container}>
      
      <View style={{marginTop: 30, marginBottom: 10, width: 350}}>
        {isEditing ? (
          <CustomButton
            title="Cancelar"
            onPress={() => setIsEditing(false)}
            styles={styles}
            gradientColors={['#ff0000', '#ffa500']}
          />
        ) : (
          <CustomButton
            title="Editar"
            onPress={() => setIsEditing(true)}
            styles={styles}
            gradientColors={['#ff8a2a', '#ffa500']}
          />
        )}
      </View>
      
      <View pointerEvents={isEditing ? 'auto' : 'none'} style={{marginTop: 10}}>


        {/* Código - Obrigatório - TextInput */}
        <Text style={styles.titleSelect}>Código</Text>
          <View style={styles.borderMargin}>
            <TextInput
              editable={locked !== 1}
              style={styles.input}
              value={code}
              onChangeText={text => setCode(text)}
              placeholder="Código"
            />
          </View>
        
        {/* Nome - Obrigatório - TextInput */}
        <Text style={styles.titleSelect}>Nome</Text>
          <View style={styles.borderMargin}>
            <TextInput
            editable={locked !== 1}
              style={styles.input}
              value={name}
              onChangeText={text => setName(text)}
              placeholder="Nome"
            />
          </View>

        {/* Categoria - Opcional - Picker (getCategorias) */}
        <Text style={styles.titleSelect}>Categoria</Text>
          <View style={styles.borderMargin}>
          <Picker
            style={styles.pickerComponent}
            selectedValue={selectedIdCategory ? selectedIdCategory.toString() : null}
            onValueChange={itemValue => { 
              setSelectedIdCategory(itemValue); 
              const selectedCategory = dadosCategorias.find(categoria => categoria.id.toString() === itemValue);
              if (selectedCategory) {
                setCategory(selectedCategory.name);
              }
            }}
          >
            <Picker.Item label="Selecione uma categoria" value={null} />
            {dadosCategorias.map((categoria, i) => (
              <Picker.Item label={categoria.name} value={categoria.id.toString()} key={i} />
            ))}
          </Picker>
          </View>

        {/* Tipo - Obrigatório - Picker */}
        <Text style={styles.titleSelect}>Tipo</Text>
          <View style={styles.borderMargin}>
            <Picker selectedValue={type} onValueChange={itemValue => setType(itemValue)} style={styles.pickerComponent} >
              <Picker.Item label="Selecione um tipo" value={null} />
              <Picker.Item label="Produto" value="P" />
              <Picker.Item label="Serviço" value="S" />
            </Picker>
          </View>

        {/* Un. medida - Obrigatório - Picker */}
        <Text style={styles.titleSelect}>Unidade</Text>
        {locked !== 1 ? (
          <View style={styles.borderMargin}>
            <Picker selectedValue={unit} onValueChange={itemValue => setUnit(itemValue)} style={styles.pickerComponent} >
              <Picker.Item label="Selecione uma unidade de medida" value={null} />
              <Picker.Item label="Kilo" value="1" />
              <Picker.Item label="Metro" value="2" />
              <Picker.Item label="Metro Quadrado" value="3" />
              <Picker.Item label="Litro" value="4" />
            </Picker>
          </View>
        ) : (
          <TextInput
            editable={false}
            value={unit}
            style={styles.pickerComponent}
          />
        )}

        {/* Qtd. Stock - Opcional - TextInput Numeric */}
        <Text style={styles.titleSelect}>QTD. Stock</Text>
        <View style={styles.borderMargin}>
          <TextInput
            style={styles.input}
            value={qtdStock}
            onChangeText={text => setQtdStock(text)}
            placeholder="QTD. Stock"
            keyboardType="numeric"
          />
        </View>

        {/* Stock Min.? - Opcional (Checkbox) */}
        <Text style={styles.titleSelect}>Stock Mínimo?</Text>
        <View>
          <CheckBox
            value={stockMin === 1}
            onValueChange={newValue => setStockMin(newValue ? 1 : 0)}
          />
        </View>

        {/* Qtd. Stock Min. - Opcional - TextInput Numeric */}
        {stockMin === 1 && (
          <View>
            <Text style={styles.titleSelect}>QTD. Stock Min.</Text>
            <View style={styles.borderMargin}>
              <TextInput
                style={styles.input}
                value={qtdStockMin}
                onChangeText={text => setQtdStockMin(text)}
                placeholder="Quantidade Stock Min."
                keyboardType="numeric"
              />
            </View>
          </View>
        )}

        {/* pvp - Obrigatório - TextInput Numeric */}
        <Text style={styles.titleSelect}>PVP</Text>
          <View style={styles.borderMargin}>
          <TextInput
              style={styles.input}
              value={pvp}
              onChangeText={text => setPvp(text)}
              placeholder="Preço PVP"
              keyboardType="numeric"
            />
          </View>

        {/* iva - Obrigatório - TextInput Numeric */}
        <Text style={styles.titleSelect}>IVA</Text>
          <View style={styles.borderMargin}>
          <Picker
            style={styles.pickerComponent}
            selectedValue={selectedIdIva.toString()}
            onValueChange={itemValue => { setSelectedIdIva(itemValue); setIva(itemValue); }} >
            <Picker.Item label="Selecione uma taxa" value={null} />
            {dadosIvas.map((tax, i) => (
              <Picker.Item label={`${tax.label}`} value={tax.id.toString()} key={i} />
            ))}
          </Picker>
          </View>

        {/* Preço Unitário - Opcional - TextInput Numeric */}
        <Text style={styles.titleSelect}>Preço Unit.</Text>
          <View style={styles.borderMargin}>
          <TextInput
              style={styles.input}
              value={precoUnit}
              onChangeText={text => setPrecoUnit(text)}
              placeholder="Preço Unitário"
              keyboardType="numeric"
            />
          </View>

        {/* Preço de custo inicial - Opcional - TextInput Numeric */}
        <Text style={styles.titleSelect}>Preço de Custo Inicial</Text>
          <View style={styles.borderMargin}>
          <TextInput
              style={styles.input}
              value={precoIni}
              onChangeText={text => setPrecoIni(text)}
              placeholder="Preço de Custo Inicial"
              keyboardType="numeric"
            />
          </View>
      </View>

      {isEditing && (
          <>
      <View style={{marginTop: 10, marginBottom: 0, width: 350}}>
        <CustomButton
          title="Confirmar"
          color="#d0933f"
          onPress={() => handleConfirmarEditar()}
          styles={styles}
          gradientColors={['#ff8a2a', '#ffa500']}
        />
      </View>
      </>
      )}
      <View style={styles.overlay} pointerEvents="none" />
      </View>
    </ScrollView>
  );
}
  
  const getStyles = (colorScheme) => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colorScheme === 'dark' ? '#333333' : '#ffffff',
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
    button: {
      alignItems: 'center',
      backgroundColor: '#d0933f',
      width: 350,
      padding: 10,
      borderRadius:10,
    },
    buttonText: {
      color: '#ffffff', // Letras brancas
      fontWeight: 'bold', // Negrito
      textAlign: 'center', // Centralizado
      fontSize: 20,
    },
    titleSelect: {
      fontSize: 20,
      margin: 10,
      fontWeight: 'bold',
      color: colorScheme === 'dark' ? '#ffffff' : '#5F5D5C',
    },
    pickerComponent: {
      width: 350,
    },
    borderMargin: {
      backgroundColor: colorScheme === 'dark' ? '#333333' : '#ffffff',
      borderWidth: 1,
      borderColor: colorScheme === 'dark' ? '#ffffff' : 'grey',
      marginBottom: 15,
      borderRadius: 7,
    },
    touchableO: {
      width: 350,
      height: 55,
      justifyContent: 'center',
    },
    overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    },
  });
  
  