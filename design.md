# Diseño de la App: Crecimiento Infantil

## Concepto General
Aplicación móvil para padres y pediatras que permite registrar y monitorear el crecimiento de niños (peso, talla, perímetro cefálico) y visualizar las medidas sobre las curvas de crecimiento de la OMS.

---

## Paleta de Colores

| Token       | Color (light) | Color (dark) | Uso                          |
|-------------|---------------|--------------|------------------------------|
| primary     | #4CAF82       | #4CAF82      | Botones principales, acento  |
| background  | #F7FAF9       | #121A17      | Fondo de pantallas           |
| surface     | #FFFFFF       | #1E2923      | Tarjetas, modales            |
| foreground  | #1A2E24       | #E8F5EE      | Texto principal              |
| muted       | #6B8C7A       | #8AADA0      | Texto secundario             |
| border      | #D4E8DC       | #2E4A3A      | Bordes, separadores          |
| success     | #22C55E       | #4ADE80      | Estados OK, percentil normal |
| warning     | #F59E0B       | #FBBF24      | Alertas, percentil bajo      |
| error       | #EF4444       | #F87171      | Errores, percentil crítico   |
| tint        | #4CAF82       | #4CAF82      | Tab bar activo               |

---

## Lista de Pantallas

| Pantalla              | Ruta                          | Descripción                                      |
|-----------------------|-------------------------------|--------------------------------------------------|
| Inicio (Mis Niños)    | `/(tabs)/index`               | Lista de niños registrados + botón agregar       |
| Agregar Niño          | `/child/add`                  | Formulario: nombre, fecha nacimiento, sexo, foto |
| Perfil del Niño       | `/child/[id]`                 | Resumen, última medida, acceso a registros       |
| Registrar Medida      | `/child/[id]/add-measurement` | Formulario: fecha, peso, talla, perímetro cef.   |
| Curvas de Crecimiento | `/child/[id]/charts`          | Gráficas OMS: peso/edad, talla/edad, IMC/edad    |
| Historial de Medidas  | `/child/[id]/history`         | Lista cronológica de todas las medidas           |
| Ajustes               | `/(tabs)/settings`            | Tema, unidades (kg/lb, cm/in), acerca de         |

---

## Flujos Principales

### Agregar un Niño
1. Pantalla Inicio → botón "+" → Formulario Agregar Niño
2. Completar nombre, fecha de nacimiento, sexo
3. Guardar → redirige a Perfil del Niño

### Registrar una Medida
1. Perfil del Niño → botón "Registrar medida"
2. Formulario con fecha, peso (kg), talla (cm), perímetro cefálico (cm)
3. Guardar → actualiza Perfil y Curvas

### Ver Curvas de Crecimiento
1. Perfil del Niño → "Ver curvas"
2. Selector de tipo: Peso/Edad, Talla/Edad, IMC/Edad, Perímetro Cefálico/Edad
3. Gráfica SVG con líneas de percentil OMS (P3, P15, P50, P85, P97)
4. Puntos del niño superpuestos sobre la curva

---

## Componentes Clave

- **ChildCard**: Tarjeta con foto, nombre, edad calculada, última medida
- **MeasurementForm**: Formulario con validación de rangos razonables
- **GrowthChart**: Gráfica SVG con curvas percentiles y puntos de medida
- **PercentileTag**: Badge de color según percentil (rojo/amarillo/verde)
- **EmptyState**: Ilustración + texto cuando no hay datos

---

## Almacenamiento
- AsyncStorage local para todos los datos (niños y medidas)
- Estructura JSON: `{ children: Child[], measurements: { [childId]: Measurement[] } }`
- Sin backend requerido (app completamente offline)

---

## Datos OMS Integrados
- Curvas de referencia OMS 2006 para niños 0-5 años y OMS 2007 para 5-19 años
- Percentiles: P3, P15, P50, P85, P97
- Indicadores: peso/edad, talla/edad, IMC/edad, perímetro cefálico/edad
- Separados por sexo (masculino/femenino)
