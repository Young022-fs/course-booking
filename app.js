let app1 = new Vue({
    el: "#vue-app",
    data(){
        return {
            subject: {id: 10001, name: 'Math', location: 'G103', price: '$54.99', availableInventory: 10, icon: 'fa-solid fa-calculator icon'},
            foreign: {id: 10002, name: 'Foreign Languages', location: 'HA110', price: '$39.99', available: 7, icon: 'fa-solid fa-language icon'},
            art: {id: 10003, name: 'Art', location: 'CG01', price: '$45.99', available: 7, icon: 'fa-solid fa-palette icon'},
            social: {id: 10004, name: 'Social Studies', location: 'CG02', price: '$24.99', available: 5, icon: 'fa-solid fa-people-roof icon'},
            chemistry: {id: 10005, name: 'Chemistry', location: 'A007', price: '$68.99', available: 9, icon: 'fa-solid fa-vial icon'},
            cart: [],
            showProduct: true,
            order: {
                firstname: "", lastname: "", address: "", city: "", state: "", zip: "", method: "Home", gift: false, sendGift: 'Yes', dontSendGift: 'No',
            }                       
        }
    },
    methods:{
        addItemToCart(){
            this.cart.push(this.subject.id);
        },
        showCheckout(){
            if(this.showProduct){
                this.showProduct = false;
            }
            else{
                this.showProduct = true;
            }
        },
        submitCheckOut(){
            alert('Check-out completed successfully')
        }
    },
    computed:{
        itemInCart: function(){
            return this.cart.length || 0;
        },
        canAddToCart(){
            return this.subject.availableInventory > this.itemInCart;
        },
        itemsLeft() {
            return this.subject.availableInventory - this.itemInCart; 
        }
    }
})