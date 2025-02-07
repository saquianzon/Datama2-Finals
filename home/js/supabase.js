        const SUPABASE_URL = "YOUR_SUPABASE_URL";
        const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";
        const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

        async function fetchMenu() {
            let { data: dishes, error } = await supabase.from('Dishes').select('*');
            if (error) console.error('Error fetching menu:', error);
            const menuContainer = document.getElementById('menu-items');
            const dishSelect = document.getElementById('dish-select');
            dishes.forEach(dish => {
                const dishElement = document.createElement('div');
                dishElement.innerHTML = `<h3>${dish.dish_name}</h3><p>Price: $${dish.price}</p>`;
                menuContainer.appendChild(dishElement);
                let option = document.createElement('option');
                option.value = dish.d_ID;
                option.textContent = dish.dish_name;
                dishSelect.appendChild(option);
            });
        }

        async function placeOrder(event) {
            event.preventDefault();
            const name = document.getElementById('customer-name').value;
            const email = document.getElementById('customer-email').value;
            const dishID = document.getElementById('dish-select').value;
            const quantity = document.getElementById('quantity').value;
            
            const { data: customer, error: custError } = await supabase.from('Customer').insert([{ first_name: name, email }]).select().single();
            if (custError) return console.error('Error adding customer:', custError);
            
            const { data: order, error: orderError } = await supabase.from('Cust_Orders').insert([{ c_ID: customer.c_ID, total_amount: 0 }]).select().single();
            if (orderError) return console.error('Error creating order:', orderError);
            
            const { error: orderDetailsError } = await supabase.from('Order_Details').insert([{ order_id: order.o_ID, dish_id: dishID, quantity }]);
            if (orderDetailsError) return console.error('Error adding order details:', orderDetailsError);
            
            alert('Order placed successfully! Your Order ID: ' + order.o_ID);
        }

        async function trackOrder() {
            const orderID = document.getElementById('order-id').value;
            let { data: delivery, error } = await supabase.from('Delivery').select('*').eq('o_ID', orderID).single();
            if (error) return console.error('Error tracking order:', error);
            document.getElementById('order-details').innerHTML = `<p>Status: ${delivery.deli_status}</p><p>Delivery Date: ${delivery.deli_date}</p>`;
        }

        document.getElementById('order-form').addEventListener('submit', placeOrder);
        fetchMenu();