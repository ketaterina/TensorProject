const App = {
    el: "app",
    delimiters: ['[[', ']]'],

    data() {
        return {
            long_room: null,
            width_room: null,
            height_room: null,
            height_door: null,
            width_door: null,
            count_door: null,
            height_window: null,
            width_window: null,
            count_window: null,
            raport: null,
            raport_true: null,
            long_raport: null,
            rashod_kraska_floor: null,
            price_floor: null,
            length_part_floor: null,
            width_part_floor: null,
            rashod_kraska_ceiling: null,
            price_ceiling: null,
            length_part_ceiling: null,
            width_part_ceiling: null,
            rashod_kraska_walls: null,
            price_walls: null,
            length_part_walls: null,
            width_part_walls: null,
            width_rul_walls:null,


            wall_area: null,
            floor_area: null,
            calc_number_floor: null,
            calc_number_ceiling: null,
            calc_number_wall: null,
            plaster: null,
            cost_plaster: null,
            level_filling: null,
            finish_filling: null,
            cost_level_filling: null,
            cost_finish_filling: null,
            primer: null,
            cost_primer: null,
            filling_ceiling: null,
            cost_filling_ceiling: null,
            coupler: null,
            cost_coupler: null,
            cost_material_floor: null,
            cost_material_ceiling: null,
            cost_material_walls: null,
            cost_ceiling: null,
            cost_walls: null,
            cost_floor: null,
            full_cost: null
        }
    },
    methods: {
        square() {
            ///   #///     Неактивная площадь комнаты  ###
            let ne_s = (this.height_window * this.width_window) * this.count_window + (this.height_door * this.width_door) * this.count_door

//   #///     Рабочая площадь стен ###
            this.wall_area = 2 * (this.long_room * this.height_room) + 2 * (this.width_room * this.height_room) - ne_s

//   #///     Площадь пол/потолок ###
            this.floor_area = this.long_room * this.width_room
        },
        get_res(unit, area, width_room, long_room, height_room, thickness, consumption,
                length_part, width_part, long_raport) {


            if (unit == "кг") { //Расчёт материалов измеряемых в килограммах
                // Площадь * Толщину слоя * Расход на 1м2 = количестов в кг
                let calc_number = Math.ceil(area * thickness * consumption)
                return calc_number//"кг"


            } else if (unit == "м.п.") { // Расчёт материалов измеряемых в метрах погонных
                let number_list = width_room / this.width_list_floor
                let length_list = parseFloat((long_room * number_list).toFixed(2) ) ///   в метрах погонных

                return length_list// "метры погонные"


            } else if (unit == "шт") { // Расчёт материалов измеряемых в количестве штук
                let value_area = area + (area * 0.05)
                let part_area = (length_part * width_part)
                let number_parts = Math.ceil(value_area / part_area)  ///   Штук  (не упаковок)

                return number_parts// "шт"


            } else if (unit == "л") { // Расчёт материалов измеряемых в литрах
                let number_paint = parseFloat((area * consumption).toFixed(2))
                return number_paint //"л"
            }


            else if (unit == "рул") { // Расчёт материалов измеряемых в рулонах
                let number_roll = 0
                if (this.raport == "1") {
                    if (this.raport_true == "1") {
                        number_roll = Math.ceil(((long_room + width_room) * 2 / width_part) * (height_room + 1.5 * long_raport) / 10)

                    } else {
                        number_roll = Math.ceil(((long_room + width_room) * 2 / width_part) * (height_room + long_raport) / 10)
                    }
                } else {
                    number_roll = Math.ceil(((long_room + width_room) * 2 / width_part) * height_room / 10)
                }

                return number_roll//"рул"


            } 
            else if (unit == "м2") { // Расчёт материалов измеряемых в метрах квадратных
                let length_list = parseFloat((area / 2.6).toFixed(2))

                return length_list// "м2"
            }
                else return 0
        },
        cost_items(price_material, calc_number){
            let costs = parseFloat((price_material * calc_number).toFixed(2))
            return costs
        },
        full_calc() {  // Функция запускает проверки и соответсвующие ей функции рассчёта
            this.square()
            this.material_ceiling = document.getElementById("input_ceiling").value;
            this.material_floor = document.getElementById("input_floor").value;
            this.material_walls = document.getElementById("input_wall").value;

            document.getElementById('output1').style.display = 'block';

            if (this.material_floor != 0) { // Расчёт материалов для пола и их цены
                // / Черновые работы
                ///   Стяжка (в кг)
                this.coupler = parseFloat((this.floor_area * 0.3 * 33).toFixed(2))
                this.cost_coupler = parseFloat((this.coupler * 17).toFixed(2))

                /// Пользовательские работы
                this.calc_number_floor = this.get_res(this.material_floor, this.floor_area, this.width_room,
                    this.long_room, this.height_room, 0.4, this.rashod_kraska_floor, 
                    this.length_part_floor, this.width_part_floor, this.long_raport)
                this.cost_material_floor = this.cost_items(this.price_floor, this.calc_number_floor)

                /// Общая стоимость для поверхности
                this.cost_floor = this.cost_coupler + this.cost_material_floor
            } else{
                this.coupler = null
                this.cost_coupler = null
                this.cost_floor = 0
                this.calc_number_floor = null
                this.cost_material_floor = null
            }


            if (this.material_ceiling != 0) { // Расчёт материалов для потолка и их цены

                // / Черновые работы, пол = потолок
                //Расчёт Шпатлёвка (в кг)
                this.filling_ceiling = parseFloat((this.floor_area * 1 * 0.2).toFixed(2))
                this.cost_filling_ceiling = parseFloat((40 * this.filling_ceiling).toFixed(2))

                /// Пользовательские работы
                this.calc_number_ceiling =  this.get_res(this.material_ceiling, this.floor_area, this.width_room,
                    this.long_room, this.height_room, 0.4, this.rashod_kraska_ceiling, 
                    this.length_part_ceiling, this.width_part_ceiling, this.long_raport)
                this.cost_material_ceiling = this.cost_items(this.price_ceiling, this.calc_number_ceiling)
                /// Общая стоимость для поверхности
                this.cost_ceiling = this.cost_filling_ceiling + this.cost_material_ceiling
            } else{
                this.calc_number_ceiling = null
                this.cost_material_ceiling = null
                this.filling_ceiling = null
                this.cost_filling_ceiling = null
                this.cost_ceiling = 0
            }


            if (this.material_walls != 0) {  // Расчёт материалов для стен и их цены
                // Черновые работы
                    ///    Расчёт Штукатурки
                this.plaster = parseFloat((this.wall_area * 1 * 0.9).toFixed(2)) //тут выводит криво без округления
                this.cost_plaster = parseFloat((14 * this.plaster).toFixed(2))


                    ///   Расчёт Шпатлёвки (в кг)
                this.level_filling = parseFloat((this.wall_area * 4.5 * 0.5).toFixed(2))
                this.finish_filling = parseFloat((this.wall_area * 1 * 0.2).toFixed(2))
                this.cost_level_filling = parseFloat((43 * this.level_filling).toFixed(2))
                this.cost_finish_filling = parseFloat((40 * this.finish_filling).toFixed(2))


                    ///   Грунтовка (в кг)
                this.primer = parseFloat((this.wall_area * 0.16).toFixed(2))
                this.cost_primer = parseFloat((84 * this.primer).toFixed(2))

                /// Пользовательские работы
                this.calc_number_wall = this.get_res(this.material_walls, this.wall_area,  this.width_room, this.long_room,
                    this.height_room, 0.1, this.rashod_kraska_walls, this.length_part_walls, this.width_rul_walls, this.long_raport)
                this.cost_material_walls = this.cost_items(this.price_walls, this.calc_number_wall)
                /// Общая стоимость для поверхности
                this.cost_walls = this.cost_plaster + this.cost_level_filling + this.cost_finish_filling +
                    this.cost_primer + this.cost_material_walls
            } else{
                this.calc_number_wall = null
                this.cost_material_walls = null
                this.plaster = null
                this.cost_plaster = null
                this.level_filling = null
                this.cost_level_filling = null
                this.level_filling = null
                this.cost_level_filling = null
                this.primer = null
                this.cost_primer = null
                this.cost_walls = 0
            }

            this.full_cost = parseFloat((this.cost_walls + this.cost_ceiling + this.cost_floor).toFixed(2))
        },
        changeRaport(){
                if (this.raport == "0") {
                    document.getElementById('div_raport_true').style.display = 'none';
                } else {
                    document.getElementById('div_raport_true').style.display = 'block';
                }
        },
        onChangeSelectedCeiling(){ //проверка на изменение выбора материалов потолка и добавление инпутов для более точных рассчетов
            this.material_ceiling = document.getElementById("input_ceiling").value;

            if( this.material_ceiling == 'шт' ){
                document.getElementById('select1_id1').style.display = 'block';
                document.getElementById('select1_id2').style.display = 'none';
                document.getElementById('select1_id3').style.display = 'none';
                document.getElementById('select1_id4').style.display = 'none';
              }
            else if(this.material_ceiling == 'л'){
                document.getElementById('select1_id1').style.display = 'none';
                document.getElementById('select1_id2').style.display = 'block';
                document.getElementById('select1_id3').style.display = 'none';
                document.getElementById('select1_id4').style.display = 'none';               
            }
            else if(this.material_ceiling == 'кг'){
                document.getElementById('select1_id1').style.display = 'none';
                document.getElementById('select1_id2').style.display = 'none';
                document.getElementById('select1_id3').style.display = 'block';
                document.getElementById('select1_id4').style.display = 'none';  
            }
            else if(this.material_ceiling == 'м2'){
                document.getElementById('select1_id1').style.display = 'none';
                document.getElementById('select1_id2').style.display = 'none';
                document.getElementById('select1_id3').style.display = 'none';
                document.getElementById('select1_id4').style.display = 'block';  
            }
            else{
                document.getElementById('select1_id1').style.display = 'none';
                document.getElementById('select1_id2').style.display = 'none';
                document.getElementById('select1_id3').style.display = 'none';
                document.getElementById('select1_id4').style.display = 'none';
            }
        },
        onChangeSelectedFloor(){ //проверка на изменение выбора материалов пола и добавление инпутов для более точных рассчетов
            this.material_floor = document.getElementById("input_floor").value;

            if( this.material_floor == 'шт' ){
                document.getElementById('select3_id1').style.display = 'block';
                document.getElementById('select3_id2').style.display = 'none';
                document.getElementById('select3_id3').style.display = 'none';
              }
            else if(this.material_floor == 'м.п.'){
                document.getElementById('select3_id1').style.display = 'none';
                document.getElementById('select3_id2').style.display = 'block';
                document.getElementById('select3_id3').style.display = 'none';
            }
            else if(this.material_floor == 'л'){
                document.getElementById('select3_id1').style.display = 'none';
                document.getElementById('select3_id2').style.display = 'none';
                document.getElementById('select3_id3').style.display = 'block';
            }
            else{
                document.getElementById('select3_id1').style.display = 'none';
                document.getElementById('select3_id2').style.display = 'none';
                document.getElementById('select3_id3').style.display = 'none';
            }
        }, 
        onChangeSelectedWalls(){ //проверка на изменение выбора материалов стен и добавление инпутов для более точных рассчетов
            this.material_wall = document.getElementById("input_wall").value;

            if( this.material_wall == 'кг' ){
                document.getElementById('select2_id1').style.display = 'block';
                document.getElementById('select2_id2').style.display = 'none';
                document.getElementById('select2_id3').style.display = 'none';
                document.getElementById('select2_id4').style.display = 'none';
              }
            else if(this.material_wall == 'л'){
                document.getElementById('select2_id1').style.display = 'none';
                document.getElementById('select2_id2').style.display = 'block';
                document.getElementById('select2_id3').style.display = 'none';
                document.getElementById('select2_id4').style.display = 'none';
            }
            else if(this.material_wall == 'шт'){
                document.getElementById('select2_id1').style.display = 'none';
                document.getElementById('select2_id2').style.display = 'none';
                document.getElementById('select2_id3').style.display = 'block';
                document.getElementById('select2_id4').style.display = 'none';
            }
            else if(this.material_wall == 'рул'){
                document.getElementById('select2_id1').style.display = 'none';
                document.getElementById('select2_id2').style.display = 'none';
                document.getElementById('select2_id3').style.display = 'none';
                document.getElementById('select2_id4').style.display = 'block';
            }
            else{
                document.getElementById('select2_id1').style.display = 'none';
                document.getElementById('select2_id2').style.display = 'none';
                document.getElementById('select2_id3').style.display = 'none';
                document.getElementById('select2_id4').style.display = 'none';
            }
        }
    }
};

Vue.createApp(App).mount('#app')